'use strict'

const DeviceModel = use('App/Models/User')
const { v4: uuidv4 } = require('uuid')

const units = {
  temp: 'degree Celcius',
  moist: 'Percentage',
  pres: 'Pa',
  alti: 'meter',
  windspkm: 'km/h',
  windspms: 'm/s',
  brig: 'lux',
  volt: 'voltage'
}

const getCurrentDate = () => {
  const currentDate = new Date()

  return new Date(
    `${currentDate.getFullYear()}-${
      currentDate.getUTCMonth() + 1
    }-${currentDate.getDate()}`
  )
}

const queryWithTimestampConditions = (
  { timestamp, type, u_id, role, dev_id },
  typeCondition = false
) => {
  const currentDate = getCurrentDate()

  if (timestamp.toLowerCase() === 'latest') {
    return DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder
        .where(
          typeCondition
            ? { timestamp_date: currentDate, type }
            : { timestamp_date: currentDate }
        )
        .with('raws', subBuilder => subBuilder.sort('-timestamp')))
      .sort('-timestamp_date')
      .first()
      .then(query => query.toJSON())
      .then(device => {
        device.sensors = device.sensors.map(sensor => {
          const [raw] = sensor.raws
          sensor.raws = undefined
          sensor.raw = raw
          return sensor
        })

        return device
      })
  }
  if (timestamp.indexOf('~') === -1) {
    const filter = new Date(timestamp)

    const timestamp_date = new Date(filter.setHours(24))

    return DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder
        .where(typeCondition ? { timestamp_date, type } : { timestamp_date })
        .with('raws', subBuilder => subBuilder.sort('-timestamp')))
      .sort('-timestamp_date')
      .first()
  }
  const timestamps = timestamp.split('~')
  const filters = [new Date(timestamps[0]), new Date(timestamps[1])]
  const timestamp_dates = [
    new Date(
      `${filters[0].getFullYear()}-${
        filters[0].getUTCMonth() + 1
      }-${filters[0].getDate()}`
    ),
    new Date(
      `${filters[1].getFullYear()}-${
        filters[1].getUTCMonth() + 1
      }-${filters[1].getDate()}`
    )
  ]

  return DeviceModel.where(
    role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
  )
    .with('sensors', builder => builder
      .where(
        typeCondition
          ? {
            timestamp_date: {
              $gte: timestamp_dates[0],
              $lte: timestamp_dates[1]
            },
            type
          }
          : {
            timestamp_date: {
              $gte: timestamp_dates[0],
              $lte: timestamp_dates[1]
            }
          }
      )
      .with('raws', subBuilder => subBuilder
        .where({ timestamp: { $gte: timestamps[0], $lte: timestamps[1] } })
        .sort('-timestamp'))
      .sort('-timestamp_date'))
    .first()
}

const createNewDevice = ({ response, auth, role, u_id }) => {
  const uuid = uuidv4()

  if (role !== 'user') {
    return response.status(403).send({
      status: 'failed',
      message: 'Access denied. only user can add devices.'
    })
  }

  return DeviceModel.create({
    u_id: uuid,
    role: 'device',
    auth_id: uuid,
    owner: u_id
  }).then(device => [device, auth.authenticator('api').generate(device)])
}

const feedNewData = ({ data, device, timestamp_date, u_id }) => {
  data.map(async d => {
    const { value, type } = d

    const sensor = await device
      .sensors()
      .where({ ref_u_id: u_id, type, timestamp_date })
      .first()

    if (sensor) {
      return sensor.raws().create({ value })
    }

    return device
      .sensors()
      .create({ s_id: uuidv4(), type, unit: units[type], timestamp_date })
      .then(newSensor => newSensor.raws().create({ value }))
  })
}

class DeviceV1Controller {
  async registerDevice ({ request, response, auth }) {
    const { u_id, role } = request

    const [device, token] = await createNewDevice({
      response,
      auth,
      role,
      u_id
    })

    return response.status(201).send({
      status: 'success',
      device,
      token: await Promise.resolve(token)
    })
  }

  async store ({ request, response }) {
    const { body, u_id } = request

    const { data } = body

    const timestamp_date = getCurrentDate()

    const device = await DeviceModel.findBy({ u_id })

    feedNewData({ data, device, timestamp_date, u_id })

    return response.status(201).send({ status: 'success' })
  }

  async index ({ response, request }) {
    const { role, u_id } = request

    const devices = await DeviceModel.where(
      role === 'admin' ? { role: 'device' } : { role: 'device', owner: u_id }
    )
      .setHidden([
        'role',
        'created_at',
        'updated_at',
        'auth_id',
        'owner',
        '_id'
      ])
      .fetch()

    return response.status(200).send({
      status: 'success',
      devices
    })
  }

  async show ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id } = params

    const currentDate = getCurrentDate()

    const result = await DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder
        .where({ timestamp_date: { $gte: currentDate } })
        .with('raws', subBuilder => subBuilder.sort('-timestamp')))
      .sort('-timestamp_date')
      .first()

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithTimestamp ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id, timestamp } = params

    const result = await queryWithTimestampConditions({
      timestamp,
      u_id,
      role,
      dev_id
    })

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithType ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id, type } = params

    const result = await DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder
        .where({ type })
        .with('raws', subBuilder => subBuilder.sort('-timestamp')))
      .sort('-timestamp_date')
      .first()

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithFilter ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id, type, timestamp } = params

    const result = await queryWithTimestampConditions(
      {
        timestamp,
        type,
        u_id,
        role,
        dev_id
      },
      true
    )

    return response.status(200).send({
      status: 'success',
      result
    })
  }
}

module.exports = DeviceV1Controller
