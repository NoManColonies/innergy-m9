'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Raw extends Model {
  static get connection () {
    return 'mongodb'
  }

  static get updatedAtColumn () {
    return null
  }

  static get createdAtColumn () {
    return 'timestamp'
  }

  sensor () {
    return this.belongsTo('App/Models/Sensor', 'ref_s_id', 's_id')
  }

  // devices () {
  //   return this.belongsTo('App/Models/Device', 'ref_d_id', 'd_id')
  // }

  // users () {
  //   return this.belongsTo('App/Models/User', 'ref_u_id', 'u_id')
  // }
}

module.exports = Raw
