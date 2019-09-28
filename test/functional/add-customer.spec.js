'use strict'

const { test, trait } = use('Test/Suite')('Add Customer')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('add a new customer with valid fields', async ({ assert, client }) => {
  const business = await Factory
    .model('App/Models/Business')
    .create()

  const user = await Factory
    .model('App/Models/User')
    .make()

  const { first_name, last_name, email, password } = user

  const newUser = await business
    .users()
    .create({ first_name, last_name, email, password })

  const customer = await Factory.model('App/Models/Customer').make()

  const data = {
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
    .post('/api/customer')
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    business_id: business.id,
    email: customer.email
  })
})

test('cannot add a new customer without first_name field', async ({ assert, client }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const {
    title,
    last_name,
    phone,
    email,
    location,
    gender,
    customer_type,
    date_of_birth
  } = await Factory.model('App/Models/Customer').make()

  const data = {
    title,
    last_name,
    phone,
    email,
    gender,
    location,
    customer_type,
    date_of_birth
  }

  const response = await client
    .post('/api/customer')
    .loginVia(user)
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([{
    message: 'first_name is required',
    field: 'first_name',
    validation: 'required'
  }])
})

test('cannot add a new customer without last_name field', async ({ assert, client }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const {
    title,
    first_name,
    phone,
    email,
    location,
    gender,
    customer_type,
    date_of_birth
  } = await Factory.model('App/Models/Customer').make()

  const data = {
    title,
    first_name,
    phone,
    email,
    gender,
    location,
    customer_type,
    date_of_birth
  }

  const response = await client
    .post('/api/customer')
    .loginVia(user)
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([{
    message: 'last_name is required',
    field: 'last_name',
    validation: 'required'
  }])
})

test('cannot add a new customer without phone field', async ({ assert, client }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const {
    title,
    first_name,
    last_name,
    email,
    location,
    gender,
    customer_type,
    date_of_birth
  } = await Factory.model('App/Models/Customer').make()

  const data = {
    title,
    first_name,
    last_name,
    email,
    gender,
    location,
    customer_type,
    date_of_birth
  }

  const response = await client
    .post('/api/customer')
    .loginVia(user)
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([{
    message: 'phone is required',
    field: 'phone',
    validation: 'required'
  }])
})

test('cannot add a new customer without first_name field', async ({ assert, client }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const {
    title,
    last_name,
    phone,
    email,
    location,
    gender,
    customer_type,
    date_of_birth
  } = await Factory.model('App/Models/Customer').make()

  const data = {
    title,
    last_name,
    phone,
    email,
    gender,
    location,
    customer_type,
    date_of_birth
  }

  const response = await client
    .post('/api/customer')
    .loginVia(user)
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([{
    message: 'first_name is required',
    field: 'first_name',
    validation: 'required'
  }])
})

test('cannot add a new customer with an invalid email', async ({ assert, client }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const {
    title,
    first_name,
    last_name,
    phone,
    location,
    gender,
    customer_type,
    date_of_birth
  } = await Factory.model('App/Models/Customer').make()

  const data = {
    title,
    first_name,
    last_name,
    phone,
    email: 'mykk',
    gender,
    location,
    customer_type,
    date_of_birth
  }

  const response = await client
    .post('/api/customer')
    .loginVia(user)
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([{
    message: 'email is not valid',
    field: 'email',
    validation: 'email'
  }])
})
