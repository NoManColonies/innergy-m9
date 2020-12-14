'use strict'

const { test, trait } = use('Test/Suite')('User Controller')
const UserModel = use('App/Models/User')
const TokenModel = use('App/Models/Token')
const Encryption = use('Encryption')

trait('Test/ApiClient')
trait('Auth/Client')

const urlEndPoint = '/api/v1/user'

// eslint-disable-next-line
const cleanUp = async ({ token }) => TokenModel.findBy({ token: await Encryption.decrypt(token) }).then(query => query.delete())

test('should return status message of success upon user instance creation.', async ({ client }) => {
  const response = await client
    .post(`${urlEndPoint}/create`)
    .header('username', 'test')
    .header('password', 'password')
    .header('email', 'example@domain.host')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  await cleanUp({ token: response.body.token.refreshToken })
})

test('should return status message of success and token upon user login via JWT.', async ({ client }) => {
  const response = await client
    .post(`${urlEndPoint}/jwt/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  await cleanUp({ token: response.body.token.refreshToken })
})

test('should return status message of success and token upon user login via API.', async ({ client }) => {
  const response = await client
    .post(`${urlEndPoint}/api/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  await cleanUp({ token: response.body.token.token })
})

test('should return status message of success when jwt session user access restricted route.', async ({ client }) => {
  const { body } = await client
    .post(`${urlEndPoint}/jwt/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  const response = await client
    .get('/api/v1')
    .header('Authorization', `Bearer ${body.token.token}`)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})

test('should return status message of success when api session user access restricted route.', async ({ client }) => {
  const { body } = await client
    .post(`${urlEndPoint}/api/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  const response = await client
    .get('/api/v1')
    .header('Authorization', `Bearer ${body.token.token}`)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})

test('should return status message of success when jwt session user request for a new tokens.', async ({ client }) => {
  const { body } = await client
    .post(`${urlEndPoint}/jwt/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  const response = await client
    .put(`${urlEndPoint}/jwt/token`)
    .header('Authorization', `Bearer ${body.token.token}`)
    .header('refreshToken', body.token.refreshToken)
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  await cleanUp({ token: response.body.token.refreshToken })
})

test('should return status message of success when jwt session user request for logout.', async ({ client }) => {
  const { body } = await client
    .post(`${urlEndPoint}/jwt/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  const response = await client
    .delete(`${urlEndPoint}/jwt/logout`)
    .header('Authorization', `Bearer ${body.token.token}`)
    .header('refreshToken', body.token.refreshToken)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})

test('should return status message of success when api session user request for logout.', async ({ client }) => {
  const { body } = await client
    .post(`${urlEndPoint}/jwt/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  const response = await client
    .delete(`${urlEndPoint}/api/logout`)
    .header('Authorization', `Bearer ${body.token.token}`)
    .end()

  await UserModel.findBy({ auth_id: 'test' }).then(query => query.delete())
  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})
