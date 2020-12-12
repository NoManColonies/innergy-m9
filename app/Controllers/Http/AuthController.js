'use strict'

const UserModel = use('App/Models/User')
const Env = use('Env')

const { v4: uuidv4 } = require('uuid')

class AuthController {
  async store ({ request, response, auth }) {
    const { qs } = request
    const username = request.header('username')
    const password = request.header('password')
    const email = request.header('email')
    const key = request.header('secretKey')
    const { session = 'jwt' } = qs
    const uuid = uuidv4()

    const user = await UserModel.create({
      u_id: uuid,
      auth_id: username,
      password,
      email,
      role: key === Env.get('APP_KEY') ? 'admin' : 'user'
    })

    const token = session === 'jwt'
      ? await auth.authenticator('jwt').withRefreshToken().generate(user)
      : await auth.authenticator('api').generate(user)

    return response.status(201).send({
      status: 'success',
      user: {
        u_id: uuid,
        username
      },
      token
    })
  }

  async loginJwt ({ request, response, auth }) {
    const username = request.header('username')
    const password = request.header('password')

    try {
      const token = await auth
        .authenticator('jwt')
        .withRefreshToken()
        .attempt(username, password)

      return response.status(201).send({
        status: 'success',
        token
      })
    } catch (e) {
      return response.status(403).send({
        status: 'failed',
        message: `Access denied. ${e.toString()}`
      })
    }
  }

  async loginApi ({ request, response, auth }) {
    const username = request.header('username')
    const password = request.header('password')

    try {
      const token = await auth.authenticator('api').attempt(username, password)

      return response.status(201).send({
        status: 'success',
        token
      })
    } catch (e) {
      return response.status(403).send({
        status: 'failed',
        message: `Access denied. ${e.toString()}`
      })
    }
  }

  async refreshJwtToken ({ request, response, auth }) {
    const refreshToken = request.header('refreshToken')

    try {
      const token = await auth
        .authenticator('jwt')
        .newRefreshToken()
        .generateForRefreshToken(refreshToken, true)

      return response.status(201).send({
        status: 'success',
        token
      })
    } catch (e) {
      return response.status(500).send({
        status: 'failed',
        message: `An error occured. ${e.toString()}`
      })
    }
  }

  async logoutJwt ({ request, response, auth }) {
    const refreshToken = request.header('refreshToken')

    try {
      await auth
        .authenticator('jwt')
        .revokeTokensForUser(
          await auth.authenticator('jwt').getUser(),
          refreshToken,
          true
        )

      return response.status(200).send({ status: 'success' })
    } catch (e) {
      return response.status(500).send({
        status: 'failed',
        message: `An error occured. ${e.toString()}`
      })
    }
  }

  async logoutApi ({ response, auth }) {
    try {
      const apiToken = auth.getAuthHeader()

      await auth.authenticator('api').revokeTokens([apiToken])

      return response.status(200).send({ status: 'success' })
    } catch (e) {
      return response.status(500).send({
        status: 'failed',
        message: 'An error occured'
      })
    }
  }

  async revokeApi ({ request, response, auth }) {
    const apiToken = request.header('apiToken')

    try {
      await auth.authenticator('api').revokeTokens([apiToken])

      return response.status(200).send({ status: 'success' })
    } catch (e) {
      return response.status(500).send({
        status: 'failed',
        message: `An error occured. ${e.toString()}`
      })
    }
  }
}

module.exports = AuthController
