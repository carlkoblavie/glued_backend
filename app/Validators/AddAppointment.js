'use strict'

class AddAppointment {
  get rules () {
    return {
      appointment_type: 'required|string',
      due_date: 'required|date',
      customer_id: 'required|number'
    }
  }

  get messages () {
    return {
      required: '{{ field }} is required',
      string: '{{ field }} is not valid',
      date: '{{ field }} is not valid'
    }
  }

  get validateAll () {
    return true
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = AddAppointment
