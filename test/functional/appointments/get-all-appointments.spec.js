'use strict'

const { test, trait } = use('Test/Suite')('Update Appointment')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('get all business appointments', async ({ assert, client }) => {
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

  const customerThree = await Factory
    .model('App/Models/Customer')
    .make()

  const newCustomerThree = await business
    .customers()
    .create(customerThree.$attributes)

  await business
    .appointments()
    .createMany([
      { appointment_type: 'nail polish', due_date: '2019-11-11', customer_id: newCustomer.id },
      { appointment_type: 'nail polish', due_date: '2019-11-11', customer_id: newCustomerTwo.id },
      { appointment_type: 'nail polish', due_date: '2019-11-11', customer_id: newCustomerThree.id }
    ])

  const response = await client
    .get('/api/appointments')
    .loginVia(newUser)
    .send()
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    { appointment_type: 'nail polish', customer_id: newCustomer.id },
    { appointment_type: 'nail polish', customer_id: newCustomerTwo.id },
    { appointment_type: 'nail polish', customer_id: newCustomerThree.id }
  ])
})
