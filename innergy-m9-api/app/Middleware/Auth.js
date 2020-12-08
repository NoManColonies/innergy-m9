'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Auth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next, properties) {
    let attemptFailedOne = false
    let loggedInMethod = ''

    try {
      await auth.authenticator('jwt').check()
      loggedInMethod = 'jwt'
    } catch (e) {
      attemptFailedOne = true
    }

    if (attemptFailedOne) {
      try {
        await auth.authenticator('api').check()
        loggedInMethod = 'api'
      } catch (e) {
        response.status(403).send({
          status: 'failed',
          message: 'Access denied. invalid jwt/api token.'
        })
        return
      }
    }

    const { role, u_id } = await auth
      .authenticator(loggedInMethod)
      .getUser()
      .then(query => query
        .with('user')
        .fetch()
        .then(subQuery => subQuery.toJSON()))

    if (properties.length && !properties.find(filter => role === filter)) {
      response.status(403).send({
        status: 'failed',
        message:
          'Access denied. your role does not have access right to this route.'
      })
      return
    }

    request.role = role
    request.u_id = u_id

    // call next to advance the request
    await next()
  }
}

module.exports = Auth
