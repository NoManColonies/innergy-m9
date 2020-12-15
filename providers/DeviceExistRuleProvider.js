'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class DeviceExistRuleProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    //
    const Validator = use('Validator')
    const UserModel = use('App/Models/User')

    const existsFn = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        /**
         * skip validation if value is not defined. `required` rule
         * should take care of it.
         */
        return
      }

      const row = await UserModel.findBy({ u_id: value, role: 'device' })

      if (!row) {
        throw message
      }
    }

    Validator.extend('deviceExists', existsFn)
  }
}

module.exports = DeviceExistRuleProvider
