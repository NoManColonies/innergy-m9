'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
// const { uuid: uuidv4 } = require('uuid')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeCreate', async userInstance => {
      if (!userInstance.dirty.auth_id) userInstance.auth_id = userInstance.dirty.username
    })
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get connection () {
    return 'mongodb'
  }

  static get hidden () {
    return ['password', 'auth_id']
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token', 'u_id', 'ref_u_id')
  }

  sensors () {
    return this.hasMany('App/Models/Sensor', 'u_id', 'ref_u_id')
  }
}

module.exports = User
