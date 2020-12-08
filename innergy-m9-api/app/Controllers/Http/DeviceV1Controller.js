'use strict'

const DeviceModel = use('App/Models/User')
const RawModel = use('App/Models/Raw')
const SensorModel = use('App/Models/Sensor')
const { v4: uuidv4 } = require('uuid')

const units = {
  temp: 'degree Celcius',
  moist: 'Percentage'
}

class DeviceV1Controller {
  async register ({ request, response }) {
    const device = await DeviceModel.create({ u_id: uuidv4(), role: 'device' })

    return response.status(201).send({
      status: 'success',
      device
    })
  }

  async feed ({ request, response }) {
    const { params, body } = request

    const { data } = body

    const { dev_id } = params

    const currentDate = new Date()

    const dateBegin = new Date(
      `${currentDate.getFullYear()}-${
        currentDate.getUTCMonth() + 1
      }-${currentDate.getDate()}`
    )

    const device = await DeviceModel.where({ u_id: dev_id })
      .fetch()
      .then(query => query.first())

    const promises = data.map(async d => {
      const { value, type } = d

      const sensor = await SensorModel.findBy({
        ref_u_id: dev_id,
        type,
        timestamp: { $gte: dateBegin }
      })

      if (sensor) {
        return sensor.raws().create({ value })
      }

      const newSensor = await device.sensor().create({
        s_id: uuidv4(),
        type,
        unit: units[type]
      })

      return newSensor.raws().create({ value })
    })

    await Promise.all(promises)

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('sensors.raws')
      .fetch()

    return response.status(201).send({
      status: 'success',
      result
    })
  }

  async store ({ request, response }) {
    const { params, body } = request

    const { value } = body

    const { dev_id, type } = params

    const device = await DeviceModel.where({ u_id: dev_id })
      .fetch()
      .then(query => query.first())

    const raw = await RawModel.findBy({ ref_u_id: dev_id, type })

    if (raw) {
      const { valueProperties } = raw.toJSON()

      raw.merge({ valueProperties: [...valueProperties, { value, timestamp: new Date() }] })

      await raw.save()

      const result = await DeviceModel.where({ u_id: dev_id })
        .with('raws')
        .fetch()

      return response.status(200).send({
        status: 'success',
        result
      })
    }

    await device.raws().create({
      type,
      valueProperties: [{ value, timestamp: new Date() }],
      unit: units[type]
    })

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('raws')
      .fetch()

    return response.status(201).send({
      status: 'success',
      result
    })
  }

  async index ({ response }) {
    const devices = await DeviceModel.where({ role: 'device' }).fetch()

    return response.status(200).send({
      status: 'success',
      devices
    })
  }

  async show ({ request, response }) {
    const { params } = request

    const { dev_id } = params

    const currentDate = new Date()

    const dateBegin = new Date(
      `${currentDate.getFullYear()}-${
        currentDate.getUTCMonth() + 1
      }-${currentDate.getDate()}`
    )

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('sensors', builder => builder.where({ timestamp: { $gte: dateBegin } }))
      .with('raws')
      .fetch()

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithTimestamp ({ request, response }) {
    const { params } = request

    const { dev_id, timestamp } = params

    const result = await DeviceModel.where({ u_id: dev_id }).with('sensors.raws', builder => builder.where({ timestamp }))

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithType ({ request, response }) {
    const { params } = request

    const { dev_id, type } = params

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('sensors', builder => builder.where({ type }))
      .with('raws')
      .fetch()

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithFilter ({ request, response }) {
    const { params } = request

    const { dev_id, type, timestamp } = params

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('sensors', builder => builder.where({ type }))
      .with('raws', builder => builder.where({ timestamp }))
      .fetch()

    return response.status(200).send({
      status: 'success',
      result
    })
  }
}

module.exports = DeviceV1Controller
