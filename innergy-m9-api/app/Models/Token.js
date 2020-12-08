'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  static get connection () {
    return 'mongodb'
  }
}

module.exports = Token
