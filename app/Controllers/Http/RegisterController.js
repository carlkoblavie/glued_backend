'use strict'
const User = use('App/Models/User')

class RegisterController {
  async store({ auth, request, response }) {

    const { first_name, last_name, email, business_id, password } = request.all()

    const user = await User
      .create({ first_name, last_name, email, business_id, password })

    const token = await auth
      .generate(user)

    response
      .ok({ user, token })
  }
}

module.exports = RegisterController
