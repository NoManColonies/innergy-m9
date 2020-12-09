'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  static get connection () {
    return 'mongodb'
  }

  static get createdAtColumn () {
    return 'loggedInAt'
  }

  static get updatedAtColumn () {
    return null
  }

  user () {
    return this.belongsTo('App/Models/User', 'ref_u_id', 'u_id')
  }
}

module.exports = Token
