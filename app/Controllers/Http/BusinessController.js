'use strict'
const Business = use('App/Models/Business')

class BusinessController {
  async store({ response, request }) {
    const business = await Business.create(
      request.only(['name', 'location', 'business_type'])
    )
    return response.created(business)
  }
}

module.exports = BusinessController
