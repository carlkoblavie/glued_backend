'use strict'

const { test, trait } = use('Test/Suite')('Schedule Appointment')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can add a new appointment', async ({ assert, client }) => {
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

  const response = await client
    .post('/api/appointments')
    .loginVia(newUser)
    .send({ appointment_type, due_date, customer_id: newCustomer.id })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    appointment_type,
    due_date,
    customer_id: newCustomer.id,
    business_id: business.id
  })
})
