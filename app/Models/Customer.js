'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Customer extends Model {
  static async index (request, auth) {
    const user = await auth.user
    const business = await user.business().fetch()
    const customers = await business.customers().fetch()
    return customers
  }

  static async store (request, auth) {
    const {
      title,
      first_name,
      last_name,
      phone,
      email,
      gender,
      location,
      date_of_birth,
      customer_type
    } = request.all()

    const business = await auth
      .user
      .business()
      .fetch()

    const customer = await business
      .customers()
      .create({
        title,
        first_name,
        last_name,
        phone,
        email,
        gender,
        location,
        date_of_birth,
        customer_type
      })

    return customer
  }

  static async isNotAuthorised (auth, customerId) {
    let notAuthorised = false
    const user = await auth.getUser()
    const customer = await this.findOrFail(customerId)
    if (customer.business_id !== user.business_id) notAuthorised = true
    return notAuthorised
  }

  static async update (request, customerId) {
    const customer = await this.find(customerId)
    await customer
      .merge(request.only(['title',
        'first_name',
        'last_name',
        'phone',
        'email',
        'gender',
        'location',
        'date_of_birth',
        'customer_type']
      ))
    await customer.save()
    return customer
  }

  static async delete (customerId) {
    const customer = await this.find(customerId)
    customer.delete()
  }

  business () {
    return this.belongsTo('App/Models/Business')
  }
}

module.exports = Customer
