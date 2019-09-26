'use strict'
const Sale = use('App/Models/Sale')

class SaleController {
  async store ({ auth, request, response }) {
    const sale = await Sale.store(request, auth)
    return response.created(sale)
  }
}

module.exports = SaleController
