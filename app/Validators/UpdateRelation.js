'use strict'

class UpdateRelation {
  get rules () {
    return {
      first_name: 'string|required',
      last_name: 'string|required',
      gender: 'string|required',
      location: 'string',
      relation_type: 'string|required'
    }
  }

  get messages() {
    return {
      string: '{{ field }} is not a valid string',
      required: '{{ field }} is required'
    }
  }

  getValidateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = UpdateRelation
