'use strict'

class LogOutController {
  async logout ({ auth }) {
    await auth.logout()
  }
}

module.exports = LogOutController
