'use strict'

class Registration {
  get rules () {
    return {
      // validation rules
      username: 'required|userExists:username',
      password: 'required|min:8',
      email: 'required|email|userExists:email'
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'username.required': 'You must provide a username.',
      'username.userExists': 'This username is already in-use.',
      'password.required': 'You must provide a password.',
      'password.min': 'Password length must exceed 8 charactors.',
      'email.required': 'You must provide an email address.',
      'email.email': 'You must provide a valid email.',
      'email.userExists': 'You must provide a unique email.'
    }
  }

  get data () {
    const requestBody = this.ctx.request.all()
    const username = this.ctx.request.header('username')
    const password = this.ctx.request.header('password')
    const email = this.ctx.request.header('email')

    return { ...requestBody, username, password, email }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = Registration
