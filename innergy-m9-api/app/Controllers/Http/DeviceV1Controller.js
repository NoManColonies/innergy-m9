'use strict'

const DeviceModel = use('App/Models/User')
// const RawModel = use('App/Models/Raw')
const SensorModel = use('App/Models/Sensor')
const { v4: uuidv4 } = require('uuid')

const units = {
  temp: 'degree Celcius',
  moist: 'Percentage'
}

class DeviceV1Controller {
  async registerDevice ({ request, response, auth }) {
    const { u_id, role } = request
    const uuid = uuidv4()

    if (role !== 'user') {
      return response.status(403).send({
        status: 'failed',
        message: 'Access denied. only user can add devices.'
      })
    }

    const device = await DeviceModel.create({
      u_id: uuid,
      role: 'device',
      auth_id: uuid,
      owner: u_id
    })

    const token = await auth.authenticator('api').generate(device)

    return response.status(201).send({
      status: 'success',
      device,
      token
    })
  }

  async store ({ request, response }) {
    const { body, u_id } = request

    const { data } = body

    const currentDate = new Date()

    const dateBegin = new Date(
      `${currentDate.getFullYear()}-${
        currentDate.getUTCMonth() + 1
      }-${currentDate.getDate()}`
    )

    const device = await DeviceModel.where({ u_id })
      .fetch()
      .then(query => query.first())

    const promises = data.map(async d => {
      const { value, type } = d

      let sensor = await SensorModel.findBy({
        ref_u_id: u_id,
        type,
        timestamp_date: dateBegin
      })

      if (sensor) {
        return sensor.raws().create({ value })
      }

      sensor = await device.sensors().create({
        s_id: uuidv4(),
        type,
        unit: units[type],
        timestamp_date: dateBegin
      })

      return sensor.raws().create({ value })
    })

    await Promise.all(promises)

    const result = await DeviceModel.where({ u_id })
      .with('sensors.raws')
      .first()

    return response.status(201).send({
      status: 'success',
      result
    })
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

    const currentDate = new Date()

    const dateBegin = new Date(
      `${currentDate.getFullYear()}-${
        currentDate.getUTCMonth() + 1
      }-${currentDate.getDate()}`
    )

    const result = await DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder.where({ timestamp_date: { $gte: dateBegin } }).with('raws'))
      .first()

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithTimestamp ({ request, response }) {
    const { params, u_id, role } = request

    const currentDate = new Date()

    const dateBegin = new Date(
      `${currentDate.getFullYear()}-${
        currentDate.getUTCMonth() + 1
      }-${currentDate.getDate()}`
    )

    const { dev_id, timestamp } = params

    let result

    if (timestamp.toLowerCase() === 'latest') {
      result = await DeviceModel.where(
        role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
      )
        .with('sensors', builder => builder
          .where({ timestamp_date: dateBegin })
          .with('raws', subBuilder => subBuilder.sort('-timestamp')))
        .first()
        .then(query => query.toJSON())

      let count
      result.sensors = result.sensors.map(sensor => {
        count = 0
        const [raw] = sensor.raws.filter(filter => {
          count += 1
          return count === 1
        })
        sensor.raws = undefined
        sensor.raw = raw
        return sensor
      })
    } else if (timestamp.indexOf('~') === -1) {
      const filter = new Date(timestamp)
      result = await DeviceModel.where(
        role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
      )
        .with('sensors', builder => builder
          .where({ timestamp_date: new Date(filter.setHours(24)) })
          .with('raws'))
        .first()
    } else {
      const timestamps = timestamp.split('~')
      const filters = [new Date(timestamps[0]), new Date(timestamps[1])]

      console.log(
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
      )
      result = await DeviceModel.where(
        role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
      )
        .with('sensors', builder => builder
          .where({
            timestamp_date: {
              $gte: new Date(
                `${filters[0].getFullYear()}-${
                  filters[0].getUTCMonth() + 1
                }-${filters[0].getDate()}`
              ),
              $lte: new Date(
                `${filters[1].getFullYear()}-${
                  filters[1].getUTCMonth() + 1
                }-${filters[1].getDate()}`
              )
            }
          })
          .with('raws', subBuilder => subBuilder.where({ timestamp: { $gte: timestamps[0], $lte: timestamps[1] } })))
        .first()
    }

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
      .with('sensors', builder => builder.where({ type }).with('raws'))
      .first()

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithFilter ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id, type, timestamp } = params

    const result = await DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder
        .where({ type })
        .with('raws', subBuilder => subBuilder.where({ timestamp })))
      .first()

    return response.status(200).send({
      status: 'success',
      result
    })
  }
}

module.exports = DeviceV1Controller
