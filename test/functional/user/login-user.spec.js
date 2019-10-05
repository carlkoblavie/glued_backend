'use strict'

const { test, trait } = use('Test/Suite')('Login User')
const Factory = use('Factory')
const User = use('App/Models/User')

trait('Test/ApiClient')

test('a JWT token is generated for a logged in user', async ({ assert, client }) => {
  const { first_name, last_name, business_id, email, password } = await Factory
    .model('App/Models/User')
    .make()
  await User.create({
    first_name,
    last_name,
    business_id,
    email,
    password
  })

  const response = await client
    .post('/api/login')
    .send({ email, password })
    .end()

  response.assertStatus(200)
  assert.isDefined(response.body.token.type)
  assert.isDefined(response.body.token.token)
})
