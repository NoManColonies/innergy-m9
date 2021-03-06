'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ExistRuleProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {}

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
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

      const [column] = args
      const row = await UserModel.findBy({ [column]: value, role: 'user' })

      if (row) {
        throw message
      }
    }

    Validator.extend('userExists', existsFn)
  }
}

module.exports = ExistRuleProvider
