'use strict'

class Relation {
  get rules () {
    return {
      first_name: 'required|string',
      last_name: 'required|string',
      title: 'string',
      last_name: 'required|string',
      phone: 'required',
      email: 'required|email|unique:relations',
      gender: 'required|string',
      location: 'string',
      relation_type: 'required|string',
      date_of_birth: 'date'
    }
  }

  get messages () {
    return {
      unique: 'This {{ field }} has already been used',
      required: '{{ field }} is required',
      string: '{{ field }} needs to be a string',
      number: '{{ field }} needs to be selected',
      email: '{{ field }} is not valid'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = Relation
