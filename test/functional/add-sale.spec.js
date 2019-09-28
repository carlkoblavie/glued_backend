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
    .create(customer.$attributes)

  const { item, price, date } = await Factory
    .model('App/Models/Sale')
    .make()

  const response = await client
    .post('/api/sales')
    .loginVia(newUser)
    .send({ item, price, date, customer_id: newCustomer.id, business_id: business.id })
    .end()

  console.log(response.error)
  response.assertStatus(201)
  response.assertJSONSubset({
    item,
    price,
    date,
    customer_id: newCustomer.id,
    business_id: business.id
  })
})
