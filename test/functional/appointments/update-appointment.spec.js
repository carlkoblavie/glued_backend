'use strict'

const { test, trait } = use('Test/Suite')('Update Appointment')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can update an appointment', async ({ assert, client }) => {
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

  const newDueDate = '2019-11-11 14:18:15'

  const data = {
    due_date: newDueDate,
    customer_id: newCustomer.id
  }

  const response = await client
    .put(`/api/appointments/update/${appointment.id}`)
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    due_date: newDueDate
  })
})
