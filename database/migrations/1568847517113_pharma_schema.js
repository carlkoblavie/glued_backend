'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PharmaSchema extends Schema {
  up () {
    this.create('pharmas', (table) => {
      table.increments()
      table.integer('sale_id').unsigned()
      table.string('dosage', 100)
      table.string('manufacturer', 100)
      table.foreign('sale_id').references('id').inTable('sales')
      table.timestamps()
    })
  }

  down () {
    this.drop('pharmas')
  }
}

module.exports = PharmaSchema
