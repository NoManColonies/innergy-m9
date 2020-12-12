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
  Route.post('/device/create', 'DeviceController.registerDevice').middleware(
    'auth:user'
  )
  Route.post('/device/feed', 'DeviceController.store').middleware('auth:device')
  Route.post('/user/create', 'AuthController.store').middleware('guest')
  Route.post('/user/jwt/login', 'AuthController.loginJwt').middleware('guest')
  Route.post('/user/api/login', 'AuthController.loginApi').middleware('guest')
  Route.put('/user/jwt/token', 'AuthController.refreshJwtToken')
  Route.delete('/user/jwt/logout', 'AuthController.logoutJwt').middleware(
    'auth:user,admin'
  )
  Route.delete('/user/api/logout', 'AuthController.logoutApi').middleware(
    'auth:user,admin'
  )
  Route.delete('/user/api/revoke', 'AuthController.revokeApi').middleware(
    'auth:user'
  )
  Route.get('/', 'DeviceController.index').middleware('auth:user,admin')
  Route.get('/:dev_id', 'DeviceController.show').middleware('auth:user,admin')
  Route.get('/t/latest', 'DeviceController.showLatest').middleware(
    'auth:user,admin'
  )
  Route.get(
    '/:dev_id/t/:timestamp',
    'DeviceV1Controller.showWithTimestamp'
  ).middleware('auth:user,admin')
  Route.get('/:dev_id/s/:type', 'DeviceController.showWithType').middleware(
    'auth:user,admin'
  )
  Route.get(
    '/:dev_id/t/:timestamp/s/:type',
    'DeviceController.showWithFilter'
  ).middleware('auth:user,admin')
  Route.get(
    '/:dev_id/s/:type/t/:timestamp',
    'DeviceController.showWithFilter'
  ).middleware('auth:user,admin')
}).prefix('api/v1')
