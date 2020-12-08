'use strict'

class DeviceController {
  async index ({ response }) {
    return response.status(200).send({
      apiStatus: 'healthy',
      devices: []
    })
  }

  async show ({ request, response }) {}

  async showWithFilter ({ request, response }) {}

  async showWithSubFilter ({ request, response }) {}
}

module.exports = DeviceController
