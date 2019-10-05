'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Business extends Model {
  static async store (request) {
    const business = await this.create(
      request.only(['name', 'location', 'business_type'])
    )
    return business
  }

  users () {
    return this.hasMany('App/Models/User')
  }

  customers () {
    return this.hasMany('App/Models/Customer')
  }

  sales () {
    return this.hasMany('App/Models/Sale')
  }

  appointments () {
    return this.hasMany('App/Models/Appointment')
  }
}

module.exports = Business
