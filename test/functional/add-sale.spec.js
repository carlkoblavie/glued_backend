'use strict'

const { test, trait } = use('Test/Suite')('Add Sale')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can add a new sale', async ({ assert, client }) => {
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
    .create({
      title: customer.title,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      email: customer.email,
      gender: customer.gender,
      customer_type: customer.customer_type,
      location: customer.location
    })

  const { item, date, price } = await Factory
    .model('App/Models/Sale')
    .make()

  const response = await client
    .post('/api/sale')
    .loginVia(newUser)
    .send({ item, date, price, customer_id: newCustomer.id })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    item,
    date,
    price
  })
})
