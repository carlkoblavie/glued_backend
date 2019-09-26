'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

Factory.blueprint('App/Models/Business', (faker) => {
  return {
    name: faker.company(),
    location: faker.street(),
    business_type: 'pharmacy'
  }
})

Factory.blueprint('App/Models/User', (faker) => {
  return {
    first_name: faker.first(),
    last_name: faker.last(),
    email: faker.email(),
    password: faker.password()
  }
})

Factory.blueprint('App/Models/Customer', (faker) => {
  return {
    title: 'Mr',
    first_name: faker.first(),
    last_name: faker.last(),
    phone: faker.phone(),
    email: faker.email(),
    gender: 'female',
    location: 'tema',
    customer_type: 'pharmacy',
    date_of_birth: null
  }
})

Factory.blueprint('App/Models/Sale', (faker) => {
  return {
    item: faker.word(),
    date: '2019/01/01',
    price: 100
  }
})
