'use strict'

class StoreBusiness {
  get rules () {
    return {
      name: 'required|string',
      location: 'required|string',
      business_type: 'required|string'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      string: '{{ field }} is not valid'
    }
  }

  get validateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = StoreBusiness
