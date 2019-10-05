'use strict'

const { test, trait } = use('Test/Suite')('Fetch Sales')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('can get all sales', async ({ assert, client }) => {
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

  const sales = await Factory
    .model('App/Models/Sale')
    .makeMany(2)

  await newCustomer
    .sales()
    .createMany([
      { ...sales[0].$attributes, business_id: business.id },
      { ...sales[1].$attributes, business_id: business.id }
    ])

  const anotherBusiness = await Factory
    .model('App/Models/Business')
    .create()

  const anotherCustomer = await Factory
    .model('App/Models/Customer')
    .make()

  const anotherNewCustomer = await anotherBusiness
    .customers()
    .create(anotherCustomer.$attributes)

  const anotherSales = await Factory
    .model('App/Models/Sale')
    .makeMany(2)

  await anotherNewCustomer
    .sales()
    .createMany([
      { ...anotherSales[0].$attributes, business_id: anotherBusiness.id },
      { ...anotherSales[1].$attributes, business_id: anotherBusiness.id }
    ])

  const response = await client
    .get('/api/all/sales')
    .loginVia(newUser)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    { item: sales[0].item },
    { item: sales[1].item }
  ])
})

test('can get one sale', async ({ assert, client }) => {
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

  const sale = await Factory
    .model('App/Models/Sale')
    .make()

  const newSale = await newCustomer
    .sales()
    .create({ ...sale.$attributes, business_id: business.id })

  const anotherSale = await Factory
    .model('App/Models/Sale')
    .make()

  await newCustomer
    .sales()
    .create({ ...anotherSale.$attributes, business_id: business.id })

  const response = await client
    .get(`/api/sales/${newSale.id}`)
    .loginVia(newUser)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset(
    { item: sale.item }
  )
})
