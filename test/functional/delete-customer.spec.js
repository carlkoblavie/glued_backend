'use strict'

const { test, trait } = use('Test/Suite')('Delete Customer')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
test('can delete a customer that belongs to the business', async ({ assert, client }) => {
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

  const customer = await Factory
    .model('App/Models/Customer')
    .make()

  await business
    .customers()
    .save(customer)

  const response = await client
    .delete(`/api/customers/${customer.id}`)
    .loginVia(newUser)
    .end()

  response.assertStatus(204)
})

test('cannot delete a customer that does not belong to the business', async ({ assert, client }) => {
  const business = await Factory
    .model('App/Models/Business')
    .create()

  const user = await Factory
    .model('App/Models/User')
    .make()

  await business
    .users()
    .create({
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
      email: user.email
    })

  const customer = await Factory
    .model('App/Models/Customer')
    .make()

  await business
    .customers()
    .save(customer)

  const anotherBusiness = await Factory
    .model('App/Models/Business')
    .create()

  const anotherUser = await Factory
    .model('App/Models/User')
    .make()

  const anotherNewUser = await anotherBusiness
    .users()
    .create({
      first_name: anotherUser.first_name,
      last_name: anotherUser.last_name,
      password: anotherUser.password,
      email: anotherUser.email
    })

  const anotherCustomer = await Factory
    .model('App/Models/Customer')
    .make()

  await anotherBusiness
    .customers()
    .save(anotherCustomer)

  const response = await client
    .delete(`/api/customers/${customer.id}`)
    .loginVia(anotherNewUser)
    .end()

  response.assertStatus(401)
  const _customer = await use('App/Models/Customer').find(customer.id)

  assert.isNotNull(_customer)
})
