'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AutoSchema extends Schema {
  up () {
    this.create('autos', (table) => {
      table.increments()
      table.string('car_make', 50)
      table.string('car_model', 20)
      table.string('registeration_number', 20)
      table.string('make_year')
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('autos')
  }
}

module.exports = AutoSchema
