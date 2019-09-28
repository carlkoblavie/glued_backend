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

  static async all (auth) {
    const user = await auth.getUser()
    const business = await user.business().fetch()
    const sales = await business.sales().fetch()
    return sales
  }

  static async show (saleId) {
    const sale = await this.findOrFail(saleId)
    return sale
  }

  static async actionNotAuthorised (auth, saleId) {
    let notAuthorised = false
    const user = await auth.getUser()
    const sale = await this.findOrFail(saleId)
    if (sale.business_id !== user.business_id) notAuthorised = true
    return notAuthorised
  }

  static async delete (saleId) {
    const sale = await this.findOrFail(saleId)
    sale.delete()
  }

  static async update (request, saleId) {
    const sale = await this.findOrFail(saleId)
    await sale.merge(request.only([
      'item',
      'price',
      'date'
    ]))

    await sale.save()
    return sale
  }

  business () {
    return this.belongsTo('App/Models/Business')
  }

  sale () {
    return this.belongsTo('App/Models/Sale')
  }
}

module.exports = Sale
