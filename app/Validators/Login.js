'use strict'

class Login {
  get rules () {
    return {
      // validation rules
      username: 'required',
      password: 'required'
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'username.required': 'You must provide a username.',
      'password.required': 'You must provide a password.'
    }
  }

  get data () {
    const requestBody = this.ctx.request.all()
    const username = this.ctx.request.header('username')
    const password = this.ctx.request.header('password')

    return { ...requestBody, username, password }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = Login
