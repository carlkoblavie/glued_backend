'use strict'

const { test, trait } = use('Test/Suite')('Delete Relation')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
test('can delete a relation that belongs to the business', async ({ assert, client }) => {
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

  const response = await client
    .delete(`/api/relations/${relation.id}`)
    .loginVia(newUser)
    .end()

  response.assertStatus(204)
})

test('cannot delete a relation that does not belong to the business', async ({ assert, client }) => {
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

  const response = await client
    .delete(`/api/relations/${relation.id}`)
    .loginVia(anotherNewUser)
    .end()

  response.assertStatus(401)
  const _relation= await use('App/Models/Relation').find(relation.id)

  assert.isNotNull(_relation)
})
