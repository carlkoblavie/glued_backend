'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Appointment extends Model {
  static async index (auth) {
    const user = await auth.getUser()
    const business = await user.business().fetch()
    const appointments = await business
      .appointments()
      .fetch()

    return appointments
  }

  static async store (request, auth) {
    const user = await auth.getUser()
    const business = await user.business().fetch()
    const { appointment_type, due_date, customer_id } = request.all()

    const appointment = await business
      .appointments()
      .create({
        appointment_type,
        due_date,
        customer_id
      })

    return appointment
  }

  static async actionIsNotAuthorised (auth, appointmentId) {
    let notAuthorised = false
    const user = await auth.getUser()
    const appointment = await this.findOrFail(appointmentId)
    if (appointment.business_id !== user.business_id) notAuthorised = true
    return notAuthorised
  }

  static async cancel (appointmentId) {
    const appointment = await this.findOrFail(appointmentId)
    appointment.merge({ app_satus: 'cancelled' })
    await appointment.save()
    return appointment
  }

  static async update (request, appointmentId) {
    const appointment = await this.findOrFail(appointmentId)
    await appointment.merge(request.only(['due_date']))
    await appointment.save()
    return appointment
  }

  static async byDate (appointmentDate) {
    const appointments = await this
      .query()
      .where('due_date', 'like', `%${appointmentDate}%`)
      .orderBy('due_date', 'desc')
      .fetch()
    return appointments
  }

  static async forCustomer (customerId) {
    const appointments = await this
      .query()
      .where('customer_id', customerId)
      .orderBy('due_date', 'desc')
      .fetch()

    return appointments
  }

  business () {
    return this.belongsTo('App/Models/Business')
  }

  customer () {
    return this.belongsTo('App/Models/Customer')
  }
}

module.exports = Appointment
