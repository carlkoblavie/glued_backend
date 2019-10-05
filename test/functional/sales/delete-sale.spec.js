'use strict'

const { test, trait } = use('Test/Suite')('Delete Sale')
trait('Test/ApiClient')
trait('Auth/Client')
const Factory = use('Factory')

test('can delete sale', async ({ assert, client }) => {
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

  const sale = await business
    .sales()
    .create({
      item,
      date,
      price,
      customer_id: newCustomer.id
    })

  const response = await client
    .delete(`/api/sales/${sale.id}`)
    .loginVia(newUser)
    .end()

  response.assertStatus(204)
})

test('cannot delete a sale belonging to another business', async ({ assert, client }) => {
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

  await business
    .sales()
    .create({
      item,
      date,
      price,
      customer_id: newCustomer.id
    })

  const anotherBusiness = await Factory
    .model('App/Models/Business')
    .create()

  const anotherCustomer = await Factory
    .model('App/Models/Customer')
    .make()

  await anotherBusiness
    .customers()
    .create({
      title: anotherCustomer.title,
      first_name: anotherCustomer.first_name,
      last_name: anotherCustomer.last_name,
      phone: anotherCustomer.phone,
      email: anotherCustomer.email,
      gender: anotherCustomer.gender,
      customer_type: anotherCustomer.customer_type,
      location: anotherCustomer.location
    })

  const anotherSale = await Factory
    .model('App/Models/Sale')
    .make()

  const anotherNewSale = await anotherBusiness
    .sales()
    .create({
      item: anotherSale.item,
      date: anotherSale.date,
      price: anotherSale.price,
      customer_id: anotherCustomer.id
    })

  const response = await client
    .delete(`/api/sales/${anotherNewSale.id}`)
    .loginVia(newUser)
    .end()

  response.assertStatus(401)
  const _sale = await use('App/Models/Sale').find(anotherNewSale.id)

  assert.isNotNull(_sale)
})
