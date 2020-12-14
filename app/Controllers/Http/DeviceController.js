'use strict'

const DeviceModel = use('App/Models/User')
const { v4: uuidv4 } = require('uuid')
const getCurrentDate = require('../../../utils/getCurrentDateFormat.utils.func')
const UserUtil = require('../../../utils/user.utils.func')
const DeviceUtil = require('../../../utils/device.utils.func')

const units = {
  temp: 'degree Celcius',
  moist: 'Percentage',
  pres: 'Pa',
  alti: 'meter',
  windspkm: 'km/h',
  windspms: 'm/s',
  winddrct: 'degree',
  gas: 'KOhms',
  brig: 'lux',
  volt: 'voltage',
  pm1: 'micro gram/cubic meter',
  pm2_5: 'micro gram/cubic meter',
  pm10: 'micro gram/cubic meter'
}

class DeviceController {
  async registerDevice ({ request, response, auth }) {
    const { u_id, role } = request

    const [device, token] = await UserUtil(DeviceModel).createNewDevice({
      response,
      auth,
      role,
      u_id,
      uuidv4
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

    await Promise.all(
      DeviceUtil({ DeviceModel }).feedNewData({
        data,
        device,
        timestamp_date,
        u_id,
        units,
        uuidv4
      })
    )

    return response.status(201).send({ status: 'success' })
  }

  async index ({ response, request }) {
    const { role, u_id } = request

    const devices = await DeviceUtil({ DeviceModel }).getDevices({ role, u_id })

    return response.status(200).send({
      status: 'success',
      devices
    })
  }

  async show ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id } = params

    const currentDate = getCurrentDate()

    const data = await DeviceUtil({ DeviceModel }).getAll({
      role,
      dev_id,
      u_id,
      currentDate
    })

    return response.status(200).send({
      status: 'success',
      data
    })
  }

  async showLatest ({ request, response }) {
    const { role, u_id } = request

    const currentDate = getCurrentDate()

    const devices = await DeviceUtil({ DeviceModel }).queryLatest({
      role,
      u_id,
      currentDate
    })
    return response.status(200).send({
      status: 'success',
      devices
    })
  }

  async showWithTimestamp ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id, timestamp } = params

    const data = await DeviceUtil({ DeviceModel }).queryWithTimestampConditions(
      {
        timestamp,
        u_id,
        role,
        dev_id,
        currentDate: getCurrentDate()
      }
    )

    return response.status(200).send({
      status: 'success',
      data
    })
  }

  async showWithType ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id, type } = params

    const data = await DeviceUtil({ DeviceModel }).queryWithType(
      role,
      dev_id,
      u_id,
      type
    )

    return response.status(200).send({
      status: 'success',
      data
    })
  }

  async showWithFilter ({ request, response }) {
    const { params, u_id, role } = request

    const { dev_id, type, timestamp } = params

    const data = await DeviceUtil({ DeviceModel }).queryWithTimestampConditions(
      {
        timestamp,
        type,
        u_id,
        role,
        dev_id,
        currentDate: getCurrentDate()
      },
      true
    )

    return response.status(200).send({
      status: 'success',
      data
    })
  }
}

module.exports = DeviceController
