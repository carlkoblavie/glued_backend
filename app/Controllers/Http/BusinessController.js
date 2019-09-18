'use strict'
const Business = use('App/Models/Business')

class BusinessController {
  async store({ response, request }) {
    const business = await Business
      .store(request)

    return response
      .created(business)
  }
}

module.exports = BusinessController
