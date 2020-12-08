'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Device extends Model {
  static get connection () {
    return 'mongodb'
  }

  raws () {
    return this.hasMany('App/Models/Raw', 'd_id', 'ref_d_id')
  }
}

module.exports = Device
