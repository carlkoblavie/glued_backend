'use strict'

const { test, trait } = use('Test/Suite')('Appointments By Date')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('get appoints by a date', async ({ assert, client }) => {
  const business = await Factory
    .model('App/Models/Business')
    .create()

  const { first_name, last_name, email, password } = await Factory
    .model('App/Models/User')
    .make()

  const newUser = await business
    .users()
    .create({ first_name, last_name, email, password })

  const customerOne = await Factory
    .model('App/Models/Customer')
    .make()

  const newCustomerOne = await business
    .customers()
    .create(customerOne.$attributes)

  const customerTwo = await Factory
    .model('App/Models/Customer')
    .make()

  const newCustomerTwo = await business
    .customers()
    .create(customerTwo.$attributes)

  const customerThree = await Factory
    .model('App/Models/Customer')
    .make()

  const newCustomerThree = await business
    .customers()
    .create(customerThree.$attributes)

  const appointmentDate = '2020-01-10'
  const anotherAppointmentDate = '2020-02-11'

  await business
    .appointments()
    .createMany([
      { appointment_type: 'nail polish', due_date: appointmentDate, customer_id: newCustomerOne.id },
      { appointment_type: 'nail polish', due_date: appointmentDate, customer_id: newCustomerTwo.id },
      { appointment_type: 'nail polish', due_date: anotherAppointmentDate, customer_id: newCustomerThree.id }
    ])

  const date = '2020-01-10'

  const response = await client
    .get(`/api/appointments/date/${date}`)
    .loginVia(newUser)
    .send()
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    { appointment_type: 'nail polish', customer_id: newCustomerOne.id },
    { appointment_type: 'nail polish', customer_id: newCustomerTwo.id }
  ])

  assert.notInclude(response.body,
    { appointment_type: 'nail polish', due_date: anotherAppointmentDate, customer_id: newCustomerOne.id })
})
