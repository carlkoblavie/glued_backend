'use strict'

const { test, trait } = use('Test/Suite')('Get Customers')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('get all the business customers', async ({ assert, client }) => {
  const business = await Factory
    .model('App/Models/Business')
    .create()

  const user = await Factory
    .model('App/Models/User')
    .make()

  const newUser = await business
    .users()
    .create({
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
      email: user.email
    })

  const anotherBusiness = await Factory
    .model('App/Models/Business')
    .create()

  const anotherUser = await Factory
    .model('App/Models/User')
    .make()

  await anotherBusiness
    .users()
    .create({
      first_name: anotherUser.first_name,
      last_name: anotherUser.last_name,
      password: anotherUser.password,
      email: anotherUser.email
    })

  const customers = await Factory
    .model('App/Models/Customer')
    .makeMany(2)

  const anotherCustomer = await Factory
    .model('App/Models/Customer')
    .makeMany(2)

  await business
    .customers()
    .saveMany(customers)

  await anotherBusiness
    .customers()
    .saveMany(anotherCustomer)

  const response = await client
    .get('/api/all/customers')
    .loginVia(newUser)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    { first_name: customers[0].first_name },
    { first_name: customers[1].first_name }
  ])
})
