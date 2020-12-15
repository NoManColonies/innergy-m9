'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class UnitExistRuleProvider extends ServiceProvider {
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

    const units = {
      temp: 'degree Celcius',
      moist: 'Percentage',
      pres: 'Pa',
      alti: 'meter',
      windspkm: 'km/h',
      windspms: 'm/s',
      winddrct: 'degree',
      gas: 'KOhms',
      brig: 'lux',
      volt: 'voltage',
      pm1: 'micro gram/cubic meter',
      pm2_5: 'micro gram/cubic meter',
      pm10: 'micro gram/cubic meter'
    }

    const existsFn = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        /**
         * skip validation if value is not defined. `required` rule
         * should take care of it.
         */
        return
      }

      const row = units[value]

      if (!row) {
        throw message
      }
    }

    Validator.extend('unitExists', existsFn)
  }
}

module.exports = UnitExistRuleProvider
