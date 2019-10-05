'use strict'
const { test, trait } = use('Test/Suite')('Update Sale')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can update a sale', async ({ assert, client }) => {
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

  const { item, date, price } = await Factory
    .model('App/Models/Sale')
    .make()

  const sale = await business
    .sales()
    .create({
      item,
      date,
      price,
      customer_id: newCustomer.id,
      business_id: business.id
    })

  const data = {
    item: 'a different item',
    date,
    price,
    customer_id: newCustomer.id,
    business_id: business.id
  }

  const response = await client
    .put(`/api/sales/${sale.id}`)
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    id: sale.id,
    item: data.item
  })
})

test('cannot update a sale belonging to another business', async ({ assert, client }) => {
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

  const { item, date, price } = await Factory
    .model('App/Models/Sale')
    .make()

  await business
    .sales()
    .create({
      item,
      date,
      price,
      customer_id: newCustomer.id,
      business_id: business.id
    })

  const anotherBusiness = await Factory
    .model('App/Models/Business')
    .create()

  const anotherCustomer = await Factory
    .model('App/Models/Customer')
    .make()

  await anotherBusiness
    .customers()
    .create(anotherCustomer.$attributes)

  const anotherSale = await Factory
    .model('App/Models/Sale')
    .make()

  const anotherNewSale = await anotherBusiness
    .sales()
    .create({
      item: anotherSale.item,
      date: anotherSale.date,
      price: anotherSale.price,
      customer_id: anotherCustomer.id,
      business_id: anotherBusiness.id
    })

  const data = {
    item: 'a different item',
    date,
    price,
    customer_id: anotherCustomer.id,
    business_id: anotherBusiness.id
  }

  const response = await client
    .put(`/api/sales/${anotherNewSale.id}`)
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(401)
  const _sale = await use('App/Models/Sale').find(anotherNewSale.id)

  assert.notEqual(_sale.item, data.item)
})
