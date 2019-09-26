'use strict'
const Customer = use('App/Models/Customer')
class CustomerController {
  constructor () {
    this.userNotAuthorised = this.userNotAuthorised.bind(this)
  }

  async store ({ auth, request, response }) {
    const customer = await Customer.store(request, auth)
    return response.created(customer)
  }

  async index ({ auth, response }) {
    const customers = await Customer.index(response, auth)
    return response.ok(customers.toJSON())
  }

  async update ({ auth, request, response, params }) {
    if (await Customer.isNotAuthorised(auth, params.id)) {
      return this.userNotAuthorised(response)
    }
    const updatedCustomer = await Customer.update(request, params.id)
    return response.ok(updatedCustomer)
  }

  async delete ({ auth, request, response, params }) {
    if (await Customer.isNotAuthorised(auth, params.id)) {
      return this.userNotAuthorised(response)
    }

    await Customer.delete(params.id)

    return response.noContent()
  }

  userNotAuthorised (response) {
    response
      .status(401)
      .send('Not authorized')
  }
}

module.exports = CustomerController
