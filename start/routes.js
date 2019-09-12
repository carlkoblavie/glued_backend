'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route
  .post('/api/business', 'BusinessController.store')
  .validator('StoreBusiness')

Route
  .post('/api/register', 'RegisterController.store')
  .validator('RegisterUser')

Route
  .post('/api/login', 'LoginController.generate')
