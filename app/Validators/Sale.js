'use strict'

class Sale {
  get rules () {
    return {
      item: 'required|string',
      date: 'required|date',
      price: 'required|number',
      customer_id: 'required|integer',
      business_id: 'required|integer'
    }
  }

  get messages () {
    return {
      required: '{{ field }} is required',
      string: '{{ field }} is not valid',
      date: '{{ field }} needs to be a date',
      integer: '{{ field }} needs to be an integer',
      number: '{{ field }} needs to be a number'
    }
  }

  get validateAll () {
    return true
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = Sale
