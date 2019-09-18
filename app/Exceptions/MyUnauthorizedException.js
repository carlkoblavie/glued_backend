'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class MyUnauthorizedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
   handle(error, { response }) {
     return response
      .status(401)
      .send('Not authorized')
   }
}

module.exports = MyUnauthorizedException
