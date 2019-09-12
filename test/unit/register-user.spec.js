'use strict'

const { test, trait } = use('Test/Suite')('Register User')
const Factory = use('Factory')
const User = use('App/Models/User')

trait('Test/ApiClient')

test('can register a new user with valid data, and generate jwt', async ({ assert, client }) => {

  const { first_name, last_name, email, business_id, password } = await Factory
    .model('App/Models/User')
    .make()

  const data = {
    first_name,
    last_name,
    email,
    business_id,
    password
  }

  const response = await client
    .post('/api/register')
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    user: {
      first_name,
      last_name,
      email,
      business_id
    }
  })
  assert.isDefined(response.body.token)
  await User.query().where({ email }).firstOrFail()
})

test('returns an error if user already exists', async ({ assert, client }) => {
  const { first_name, last_name, email, business_id, password } = await Factory
    .model('App/Models/User')
    .create()

  const data = {
    first_name,
    last_name,
    email,
    business_id,
    password
  }

  const response = await client
    .post('/api/register')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([
		{
			message: 'This email has already been used',
			field: 'email',
			validation: 'unique'
		}
	])
})

test('returns an error if first_name is not provided', async ({ assert, client }) => {
  const { last_name, email, business_id, password } = await Factory
    .model('App/Models/User')
    .make()

  const data = {
    last_name,
    email,
    business_id,
    password
  }

  const response = await client
    .post('api/register')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([
    {
			message: 'first_name is required',
			field: 'first_name',
			validation: 'required'
		}
  ])
})

test('returns an error if last_name is not provided', async ({ assert, client }) => {
  const { first_name, email, business_id, password } = await Factory
    .model('App/Models/User')
    .make()

  const data = {
    first_name,
    email,
    business_id,
    password
  }

  const response = await client
    .post('api/register')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([
    {
			message: 'last_name is required',
			field: 'last_name',
			validation: 'required'
		}
  ])
})
