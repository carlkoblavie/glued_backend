'use strict'

const { test, trait } = use('Test/Suite')('Relation')
const Factory = use('Factory')
const Relation = use('App/Models/Relation')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

test('add a new relation with valid fields', async ({ assert, client }) => {

  const user = await Factory
    .model('App/Models/User')
    .create()

  const {
    title,
    first_name,
    last_name,
    phone,
    email,
    location,
    relation_type
  } = await Factory.model('App/Models/Relation').make()

  const data = {
    title,
    first_name,
    last_name,
    phone,
    email,
    location,
    relation_type
  }

  const response = await client
    .post('/api/relation')
    .loginVia(user)
    .send(data)
    .end()

  response.assert(200)
  response.assertJSONSubset({
    title,
    first_name,
    last_name,
    phone,
    email,
    location,
    relation_type
  })
})
