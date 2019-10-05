'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppointmentSchema extends Schema {
  up () {
    this.create('appointments', (table) => {
      table.increments()
      table.integer('customer_id').unsigned().notNullable()
      table.foreign('customer_id').references('id').inTable('customers')
      table.integer('business_id').unsigned().notNullable()
      table.foreign('business_id').references('id').inTable('businesses')
      table.string('appointment_type', 100).notNullable()
      table.dateTime('due_date').notNullable()
      table.string('app_satus').defaultTo('active')
      table.string('notes')
      table.timestamps()
      table.unique(['customer_id', 'due_date'])
    })
  }

  down () {
    this.drop('appointments')
  }
}

module.exports = AppointmentSchema
