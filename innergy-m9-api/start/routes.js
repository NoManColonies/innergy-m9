'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => ({ greeting: 'Welcome to innergy M9 project API!' }))

Route.group(() => {
  Route.get('/', 'DeviceController.index').middleware('auth:user,admin')
  Route.get('/:dev_id', 'DeviceController.show').middleware('auth:user,admin')
  Route.get('/:dev_id/:filter', 'DeviceController.showWithFilter').middleware(
    'auth:user,admin'
  )
  Route.get(
    '/:dev_id/:filter/:sub_filter',
    'DeviceController.showWithSubFilter'
  ).middleware('auth:user,admin')
}).prefix('api/v0')

Route.group(() => {
  Route.post('/feed', 'DeviceV1Controller.register').middleware('auth:user')
  Route.post('/feed/:dev_id', 'DeviceV1Controller.feed').middleware(
    'auth:device'
  )
  Route.post('/feed/:dev_id/:type', 'DeviceV1Controller.store').middleware(
    'auth:device'
  )
  Route.get('/view', 'DeviceV1Controller.index').middleware('auth:user,admin')
  Route.get('/view/:dev_id', 'DeviceV1Controller.show').middleware(
    'auth:user,admin'
  )
  Route.get(
    '/view/:dev_id/d/:timestamp',
    'DeviceV1Controller.showWithTimestamp'
  ).middleware('auth:user,admin')
  Route.get(
    '/view/:dev_id/t/:type',
    'DeviceV1Controller.showWithType'
  ).middleware('auth:user,admin')
  Route.get(
    '/view/:dev_id/d/:timestamp/t/:type',
    'DeviceV1Controller.showWithFilter'
  ).middleware('auth:user,admin')
  Route.get(
    '/view/:dev_id/t/:type/d/:timestamp',
    'DeviceV1Controller.showWithFilter'
  ).middleware('auth:user,admin')
}).prefix('api/v1')
