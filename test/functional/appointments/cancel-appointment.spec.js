'use strict'

const { test, trait } = use('Test/Suite')('Cancel Appointment')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can cancel an appointment', async ({ assert, client }) => {
  const business = await Factory
    .model('App/Models/Business')
    .create()

  const { first_name, last_name, email, password } = await Factory
    .model('App/Models/User')
    .make()

  const newUser = await business
    .users()
    .create({ first_name, last_name, email, password })

  const customer = await Factory
    .model('App/Models/Customer')
    .make()

  const newCustomer = await business
    .customers()
    .create(customer.$attributes)

  const { appointment_type, due_date } = await Factory
    .model('App/Models/Appointment')
    .make()

  const appointment = await business
    .appointments()
    .create({
      appointment_type,
      due_date,
      customer_id: newCustomer.id
    })

  const response = await client
    .put(`/api/appointments/cancel/${appointment.id}`)
    .loginVia(newUser)
    .send()
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    app_satus: 'cancelled'
  })
})
