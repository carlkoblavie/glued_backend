'use strict'

class LogOutController {
  await logout ({ auth }) {
    auth.logout()
  }
}

module.exports = LogOutController
