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
  Route.post('/device/feed', 'DeviceController.store')
    .middleware('auth:device')
    .validator('DeviceFeed')
  Route.post('/user/create', 'AuthController.store')
    .middleware('guest')
    .validator('Registration')
  Route.post('/user/jwt/login', 'AuthController.loginJwt')
    .middleware('guest')
    .validator('Login')
  Route.post('/user/api/login', 'AuthController.loginApi')
    .middleware('guest')
    .validator('Login')
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
  Route.get('/:dev_id', 'DeviceController.show')
    .middleware('auth:user,admin')
    .validator('DeviceQuery')
  Route.get('/t/latest', 'DeviceController.showLatest').middleware(
    'auth:user,admin'
  )
  Route.get('/:dev_id/t/:timestamp', 'DeviceController.showWithTimestamp')
    .middleware('auth:user,admin')
    .validator('DeviceQuery')
  Route.get('/:dev_id/s/:type', 'DeviceController.showWithType')
    .middleware('auth:user,admin')
    .validator('DeviceQuery')
  Route.get('/:dev_id/t/:timestamp/s/:type', 'DeviceController.showWithFilter')
    .middleware('auth:user,admin')
    .validator('DeviceQuery')
  Route.get('/:dev_id/s/:type/t/:timestamp', 'DeviceController.showWithFilter')
    .middleware('auth:user,admin')
    .validator('DeviceQuery')
}).prefix('api/v1')
