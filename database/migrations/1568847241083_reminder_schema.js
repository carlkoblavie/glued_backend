'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReminderSchema extends Schema {
  up () {
    this.create('reminders', (table) => {
      table.increments()
      table.integer('sale_id').unsigned()
      table.date('next_order').notNullable()
      table.date('first_reminder').notNullable()
      table.date('last_reminder').notNullable()
      table.foreign('sale_id').references('id').inTable('sales')
      table.timestamps()
    })
  }

  down () {
    this.drop('reminders')
  }
}

module.exports = ReminderSchema
