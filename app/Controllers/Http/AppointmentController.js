'use strict'
const Appointment = use('App/Models/Appointment')
const UnauthorizedException = use('App/Exceptions/UnauthorizedException')

class AppointmentController {
  async index ({ response, auth }) {
    const appointments = await Appointment.index(auth)
    return response.ok(appointments)
  }

  async store ({ response, request, auth }) {
    const appointment = await Appointment.store(request, auth)
    return response.created(appointment)
  }

  async cancel ({ response, auth, params }) {
    if (await Appointment.actionIsNotAuthorised(auth, params.id)) {
      throw new UnauthorizedException()
    }
    const appointment = await Appointment.cancel(params.id)
    return response.ok(appointment)
  }

  async update ({ request, response, auth, params }) {
    if (await Appointment.actionIsNotAuthorised(auth, params.id)) {
      throw new UnauthorizedException()
    }
    const appointment = await Appointment.update(request, params.id)
    return response.ok(appointment)
  }

  async byDate ({ response, params }) {
    const appointments = await Appointment.byDate(params.date)
    return response.ok(appointments)
  }

  async forCustomer ({ response, params }) {
    const appointments = await Appointment.forCustomer(params.customer_id)
    return response.ok(appointments)
  }
}

module.exports = AppointmentController
