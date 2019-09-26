'use strict'

const { test, trait } = use('Test/Suite')('Update Customers')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
test('can update a customer', async ({ assert, client }) => {
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

  const data = {
    first_name: 'NewFirstName',
    title: customer.title,
    first_name: customer.first_name,
    last_name: customer.last_name,
    phone: customer.phone,
    email: customer.email,
    gender: customer.gender,
    location: customer.location,
    customer_type: customer.customer_type,
    date_of_birth: customer.date_of_birth
  }
  const response = await client
    .put(`/api/customers/${customer.id}`)
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    id: customer.id,
    first_name: data.first_name
  })
})

test('cannot update customer of another business', async ({ assert, client }) => {
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

  const anotherCustomer = await Factory
    .model('App/Models/Customer')
    .make()

  await anotherBusiness
    .customers()
    .save(anotherCustomer)

  const data = {
    title: anotherCustomer.title,
    first_name: 'NewFirstName',
    last_name: anotherCustomer.last_name,
    phone: anotherCustomer.phone,
    email: anotherCustomer.email,
    gender: anotherCustomer.gender,
    location: anotherCustomer.location,
    customer_type: anotherCustomer.customer_type,
    date_of_birth: anotherCustomer.date_of_birth
  }

  const response = await client
    .put(`/api/customers/${anotherCustomer.id}`)
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(401)
  const _customer = await use('App/Models/Customer').find(anotherCustomer.id)

  assert.notEqual(_customer.first_name, data.first_name)
})
