'use strict'

const { test, trait } = use('Test/Suite')('Add Relation')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('add a new relation with valid fields', async ({ assert, client }) => {
  const business = await Factory
  .model('App/Models/Business')
  .create()

  const { first_name, last_name, email, password } = await Factory
    .model('App/Models/User')
    .make()

  const newUser = await business
    .users()
    .create({ first_name, last_name, email, password })

  const relation = await Factory.model('App/Models/Relation').make()

  const data = {
    title: relation.title,
    first_name: relation.first_name,
    last_name: relation.last_name,
    phone: relation.phone,
    email: relation.email,
    gender: relation.gender,
    location: relation.location,
    relation_type: relation.relation_type,
    date_of_birth: relation.date_of_birth
  }

  const response = await client
    .post('/api/relation')
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    business_id: business.id,
    email: relation.email
  })
})


test('cannot add a new relation without first_name field', async({ assert, client }) => {
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
      relation_type,
      date_of_birth
    } = await Factory.model('App/Models/Relation').make()

    const data = {
      title,
      last_name,
      phone,
      email,
      gender,
      location,
      relation_type,
      date_of_birth
    }

    const response = await client
      .post('/api/relation')
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

test('cannot add a new relation without last_name field', async({ assert, client }) => {
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
      relation_type,
      date_of_birth
    } = await Factory.model('App/Models/Relation').make()

    const data = {
      title,
      first_name,
      phone,
      email,
      gender,
      location,
      relation_type,
      date_of_birth
    }

    const response = await client
      .post('/api/relation')
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

test('cannot add a new relation without phone field', async({ assert, client }) => {
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
      relation_type,
      date_of_birth
    } = await Factory.model('App/Models/Relation').make()

    const data = {
      title,
      first_name,
      last_name,
      email,
      gender,
      location,
      relation_type,
      date_of_birth
    }

    const response = await client
      .post('/api/relation')
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

test('cannot add a new relation without first_name field', async({ assert, client }) => {
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
      relation_type,
      date_of_birth
    } = await Factory.model('App/Models/Relation').make()

    const data = {
      title,
      last_name,
      phone,
      email,
      gender,
      location,
      relation_type,
      date_of_birth
    }

    const response = await client
      .post('/api/relation')
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

test('cannot add a new relation with an invalid email', async({ assert, client }) => {
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
      relation_type,
      date_of_birth
    } = await Factory.model('App/Models/Relation').make()

    const data = {
      title,
      first_name,
      last_name,
      phone,
      email: 'mykk',
      gender,
      location,
      relation_type,
      date_of_birth
    }

    const response = await client
      .post('/api/relation')
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
