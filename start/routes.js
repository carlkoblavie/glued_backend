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
  .validator('AddBusiness')

Route
  .post('/api/user', 'UserController.store')
  .validator('AddUser')

Route
  .post('/api/login', 'LoginController.generate')

Route
  .post('/api/customer', 'CustomerController.store')
  .middleware('auth')
  .validator('Customer')

Route
  .get('/api/all/customers/', 'CustomerController.index')
  .middleware('auth')

Route
  .get('/api/customer/search/:keyword', 'CustomerController.search')
  .middleware('auth')

Route
  .put('/api/customers/:id', 'CustomerController.update')
  .validator('UpdateCustomer')
  .middleware('auth')

Route
  .delete('/api/customers/:id', 'CustomerController.delete')
  .middleware('auth')

Route
  .post('/api/sales', 'SaleController.store')
  .middleware('auth')
  .validator('Sale')

Route
  .delete('api/sales/:id', 'SaleController.delete')
  .middleware('auth')

Route
  .put('/api/sales/:id', 'SaleController.update')
  .middleware('auth')
  .validator('UpdateSale')

Route
  .get('/api/all/sales', 'SaleController.index')

Route
  .get('/api/sales/:id', 'SaleController.show')

Route
  .post('/api/appointments', 'AppointmentController.store')
  .middleware('auth')
  .validator('AddAppointment')

Route
  .put('/api/appointments/cancel/:id', 'AppointmentController.cancel')
  .middleware('auth')
Route
  .put('/api/appointments/update/:id', 'AppointmentController.update')
  .middleware('auth')

Route
  .get('/api/appointments/date/:date', 'AppointmentController.byDate')
  .middleware('auth')
Route
  .get('/api/appointments/customer/:customer_id', 'AppointmentController.forCustomer')
  .middleware('auth')

Route
  .get('/api/appointments', 'AppointmentController.index')
  .middleware('auth')
