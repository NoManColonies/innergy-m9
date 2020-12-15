'use strict'

class DeviceQuery {
  get rules () {
    return {
      // validation rules
      dev_id: 'required|deviceExists'
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'dev_id.required': 'You must provide a device ID.',
      'dev_id.deviceExists': 'You must provide a valid device ID.'
    }
  }

  get data () {
    const requestBody = this.ctx.request.all()
    const { dev_id } = this.ctx.request.params

    return { ...requestBody, dev_id }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = DeviceQuery
