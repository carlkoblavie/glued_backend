'use strict'

const { test, trait } = use('Test/Suite')('Update Relations')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
test('can update a relation', async ({ assert, client }) => {
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

  const relation = await Factory
    .model('App/Models/Relation')
    .make()

  await business
    .relations()
    .save(relation)

  const data = {
    first_name: 'NewFirstName',
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
    .put(`/api/relations/${relation.id}`)
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    id: relation.id,
    first_name: data.first_name
  })
})

test('cannot update relation of another business', async ({ assert, client }) => {
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

  const relation = await Factory
    .model('App/Models/Relation')
    .make()

  await business
    .relations()
    .save(relation)

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

  const anotherRelation = await Factory
      .model('App/Models/Relation')
      .make()

  await anotherBusiness
    .relations()
    .save(anotherRelation)

  const data = {
    title: anotherRelation.title,
    first_name: 'NewFirstName',
    last_name: anotherRelation.last_name,
    phone: anotherRelation.phone,
    email: anotherRelation.email,
    gender: anotherRelation.gender,
    location: anotherRelation.location,
    relation_type: anotherRelation.relation_type,
    date_of_birth: anotherRelation.date_of_birth
  }

  const response = await client
    .put(`/api/relations/${anotherRelation.id}`)
    .loginVia(newUser)
    .send(data)
    .end()

  response.assertStatus(401)
  const _relation = await use('App/Models/Relation').find(anotherRelation.id)

  assert.notEqual(_relation.first_name, data.first_name)
})
