'use strict'

const { test, trait } = use('Test/Suite')('Search Customer')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can search a customer', async ({ assert, client }) => {
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

  const response = await client
    .get(`/api/customer/search/${newCustomer.first_name}`)
    .loginVia(newUser)
    .send()
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    first_name: newCustomer.first_name
  }])
})
