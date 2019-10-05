'use strict'

const { test, trait } = use('Test/Suite')('Get Customer Appointments')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can get a customer\'s appointment', async ({ assert, client }) => {
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

  const customerTwo = await Factory
    .model('App/Models/Customer')
    .make()

  const newCustomerTwo = await business
    .customers()
    .create(customerTwo.$attributes)

  const pastAppointmentDate = '2018-01-10'
  const anotherPastAppointmentDate = '2018-02-10'
  const futureAppointmentDate = '2020-02-11'

  await business
    .appointments()
    .createMany([
      { appointment_type: 'nail polish', due_date: pastAppointmentDate, customer_id: newCustomer.id },
      { appointment_type: 'nail polish', due_date: anotherPastAppointmentDate, customer_id: newCustomer.id },
      { appointment_type: 'nail polish', due_date: futureAppointmentDate, customer_id: newCustomer.id },
      { appointment_type: 'nail polish', due_date: futureAppointmentDate, customer_id: newCustomerTwo.id }
    ])

  const response = await client
    .get(`/api/appointments/customer/${newCustomer.id}`)
    .loginVia(newUser)
    .send()
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    { appointment_type: 'nail polish', customer_id: newCustomer.id },
    { appointment_type: 'nail polish', customer_id: newCustomer.id },
    { appointment_type: 'nail polish', customer_id: newCustomer.id }
  ])

  assert.notInclude(response.body,
    { appointment_type: 'nail polish', due_date: futureAppointmentDate, customer_id: newCustomerTwo.id })
})
