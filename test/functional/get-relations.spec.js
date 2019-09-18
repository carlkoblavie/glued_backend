'use strict'

const { test, trait } = use('Test/Suite')('Get Relations')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('get all the business relations', async ({ assert, client }) => {
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

  const relations = await Factory
    .model('App/Models/Relation')
    .makeMany(2)

  const anotherRelations = await Factory
    .model('App/Models/Relation')
    .makeMany(2)

  await business
    .relations()
    .saveMany(relations)

  await anotherBusiness
    .relations()
    .saveMany(anotherRelations)

  const response = await client
    .get('/api/all/relations')
    .loginVia(newUser)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    { first_name: relations[0].first_name },
    { first_name: relations[1].first_name }
  ])
})
