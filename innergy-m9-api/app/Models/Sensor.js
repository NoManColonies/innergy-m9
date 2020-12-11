'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sensor extends Model {
  static get connection () {
    return 'mongodb'
  }

  static get updatedAtColumn () {
    return null
  }

  static get createdAtColumn () {
    return null
  }

  user () {
    return this.belongsTo('App/Models/User', 'ref_u_id', 'u_id')
  }

  valueProperties () {
    return this.hasMany('App/Models/Raw', 's_id', 'ref_s_id')
  }
}

module.exports = Sensor
