'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SaleSchema extends Schema {
  up () {
    this.create('sales', (table) => {
      table.increments()
      table.string('item', 100).notNullable()
      table.date('date').notNullable()
      table.decimal('price').notNullable()
      table.integer('customer_id').unsigned()
      table.foreign('customer_id').references('id').inTable('customers')
      table.integer('business_id').unsigned()
      table.foreign('business_id').references('id').inTable('businesses')
      table.timestamps()
    })
  }

  down () {
    this.drop('sales')
  }
}

module.exports = SaleSchema
