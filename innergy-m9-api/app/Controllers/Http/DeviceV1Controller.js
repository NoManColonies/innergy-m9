'use strict'

const DeviceModel = use('App/Models/User')
const RawModel = use('App/Models/Raw')
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

    const device = await DeviceModel.where({ u_id: dev_id })
      .fetch()
      .then(query => query.first())

    const promises = data.map(async d => {
      const { value, type } = d

      const raw = await RawModel.findBy({ ref_u_id: dev_id, type })

      if (raw) {
        const { valueProperties } = raw.toJSON()

        raw.merge({
          valueProperties: [
            ...valueProperties,
            { value, timestamp: new Date() }
          ]
        })

        return raw.save()
      }

      return device.raws().create({
        type,
        valueProperties: [{ value, timestamp: new Date() }],
        unit: units[type]
      })
    })

    await Promise.all(promises)

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('raws')
      .fetch()

    return response.status(200).send({
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
    const devices = await DeviceModel.all()

    return response.status(200).send({
      status: 'success',
      devices
    })
  }

  async show ({ request, response }) {
    const { params } = request

    const { dev_id } = params

    const result = await DeviceModel.where({ u_id: dev_id })
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

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('raws', query => query.where('timestamp').eq(timestamp))
      .fetch()

    return response.status(200).send({
      status: 'success',
      result
    })
  }

  async showWithType ({ request, response }) {
    const { params } = request

    const { dev_id, type } = params

    const result = await DeviceModel.where({ u_id: dev_id })
      .with('raws', query => query.where('type').eq(type))
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
      .with('raws', query => query.where({ type, timestamp }))
      .fetch()

    return response.status(200).send({
      status: 'success',
      result
    })
  }
}

module.exports = DeviceV1Controller
