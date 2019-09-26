'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RelationSchema extends Schema {
  up () {
    this.create('customers', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').unique()
      table.string('phone').notNullable()
      table.string('date_of_birth')
      table.string('gender')
      table.string('location')
      table.integer('business_id').unsigned().notNullable()
      table.string('customer_type').notNullable()
      table.timestamps()

      table.foreign('business_id').references('id').inTable('businesses')
    })
  }

  down () {
    this.drop('customers')
  }
}

module.exports = RelationSchema
