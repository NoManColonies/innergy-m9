'use strict'

class DeviceFeed {
  get rules () {
    return {
      // validation rules
      data: 'required|databodyExists'
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'data.required': 'You must provide a data array.',
      'data.databodyExists': 'You must provide a valid data properties.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = DeviceFeed
