'use strict'

/** @type {import('lucid-mongo/src/Schema')} */
const MongoSchema = use('MongoSchema')

class DevicesSchema extends MongoSchema {
  up () {
    // this.create('devices', collection => {
    //   collection.index('title_index', { title: 1 })
    // })
  }

  down () {
    // this.drop('devices')
  }
}

module.exports = DevicesSchema
