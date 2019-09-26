'use strict'
const User = use('App/Models/User')

class UserController {
  async store ({ auth, request, response }) {
    const { user, token } = await User
      .store(request, auth)

    response
      .ok({ user, token })
  }
}

module.exports = UserController
