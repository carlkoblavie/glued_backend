'use strict'
const Relation = use('App/Models/Relation')
// const MyUnauthorizedException = use('App/Exceptions/MyUnauthorizedException')
class RelationController {
  async store ({ auth, request, response }) {
    const {
      title,
      first_name,
      last_name,
      phone,
      email,
      gender,
      location,
      date_of_birth,
      relation_type
    } = request.all()

    const business = await auth
      .user
      .business()
      .fetch()

    const relation = await business
      .relations()
      .create({
        title,
        first_name,
        last_name,
        phone,
        email,
        gender,
        location,
        date_of_birth,
        relation_type
      })

  return response.created(relation)
  }

  async index ({ auth, response }) {
    const user = await auth.user

    const business = await user.business().fetch()
    const relations = await business.relations().fetch()

    return response.ok(relations.toJSON())
  }

  async update ({ auth, request, response, params }) {
    const user = await auth.getUser()
    const relation = await Relation.findOrFail(params.id)
    if (relation.business_id !== user.business_id) {
      return response
       .status(401)
       .send('Not authorized')
    }

    relation
      .merge(request.only(['title',
      'first_name',
      'last_name',
      'phone',
      'email',
      'gender',
      'location',
      'date_of_birth',
      'relation_type']
    ))


    await relation.save()
    return response.ok(relation)
  }

  async delete ({ auth, request, response, params }) {
    const user = await auth.getUser()
    const relation = await Relation.findOrFail(params.id)

    if (relation.business_id !== user.business_id) {
      return response
       .status(401)
       .send('Not authorized')
    }

    await relation.delete()

    return response.noContent()
  }
}

module.exports = RelationController
