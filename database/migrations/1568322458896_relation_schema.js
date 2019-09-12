'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RelationSchema extends Schema {
  up () {
    this.create('relations', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').unique()
      table.string('phone').notNullable()
      table.string('date_of_birth')
      table.string('gender')
      table.string('location')
      table.string('relation_type').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('relations')
  }
}

module.exports = RelationSchema
