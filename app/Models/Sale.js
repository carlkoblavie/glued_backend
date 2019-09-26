'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sale extends Model {
  static async store (request, auth) {
    const {
      item,
      price,
      date,
      customer_id
    } = request.all()

    const business = await auth
      .user
      .business()
      .fetch()

    const sale = await business
      .sales()
      .create({
        item,
        price,
        date,
        customer_id
      })

    return sale
  }

  business () {
    return this.belongsTo('App/Models/Business')
  }
}

module.exports = Sale
