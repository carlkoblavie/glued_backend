'use strict'

class AddUser {
  get rules () {
    return {
      email: 'unique:users|email',
      first_name: 'required|string',
      last_name: 'required|string',
      business_id: 'required|number'
    }
  }

  get messages () {
    return {
      unique: 'This {{ field }} has already been used',
      required: '{{ field }} is required',
      string: '{{ field }} needs to be a string',
      number: '{{ field }} needs to be selected',
      email: 'Please provide a valid {{ field }}'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = AddUser
