'use strict'
const Customer = use('App/Models/Customer')
const UnauthorizedException = use('App/Exceptions/UnauthorizedException')

class CustomerController {
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
      throw new UnauthorizedException()
    }

    const updatedCustomer = await Customer.update(request, params.id)
    return response.ok(updatedCustomer)
  }

  async delete ({ auth, request, response, params }) {
    if (await Customer.isNotAuthorised(auth, params.id)) {
      throw new UnauthorizedException()
    }
    await Customer.delete(params.id)
    return response.noContent()
  }

  async search ({ auth, request, response, params }) {
    const keyword = params.keyword
    if (keyword) {
      const user = await auth.getUser()
      const business = await user.business().fetch()

      const customers = await Customer
        .query()
        .byKeyword(keyword)
        .where('business_id', business.id)
        .fetch()

      return response.ok(customers)
    }
  }
}

module.exports = CustomerController
