'use strict'
const Sale = use('App/Models/Sale')
const UnauthorizedException = use('App/Exceptions/UnauthorizedException')

class SaleController {
  async index ({ auth, response }) {
    const sales = await Sale.all(auth)
    return response.ok(sales.toJSON())
  }

  async show ({ auth, request, response, params }) {
    if (await Sale.actionNotAuthorised(auth, params.id)) {
      throw new UnauthorizedException()
    }
    const saleId = params.id
    if (saleId) {
      const sale = await Sale.show(saleId)
      return response.ok(sale)
    }
  }

  async store ({ auth, request, response }) {
    const sale = await Sale.store(request, auth)
    return response.created(sale)
  }

  async update ({ auth, request, response, params }) {
    if (await Sale.actionNotAuthorised(auth, params.id)) {
      throw new UnauthorizedException()
    }
    const updatedSale = await Sale.update(request, params.id)
    return response.ok(updatedSale)
  }

  async delete ({ auth, response, params }) {
    if (await Sale.actionNotAuthorised(auth, params.id)) {
      throw new UnauthorizedException()
    }
    await Sale.delete(params.id)
    return response.noContent()
  }
}

module.exports = SaleController
