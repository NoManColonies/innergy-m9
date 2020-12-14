'use strict'

const { test, trait } = use('Test/Suite')('User Controller')
const UserModel = use('App/Models/User')
const TokenModel = use('App/Models/Token')
const Encryption = use('Encryption')

trait('Test/ApiClient')
trait('Auth/Client')

const urlEndPoint = '/api/v1/user'

const cleanUp = async ({ user, token }) => {
  if (user) {
    await UserModel.findBy({ auth_id: user }).then(query => {
      if (query) return query.delete()
    })
  }
  if (token) {
    await TokenModel.findBy({ token: await Encryption.decrypt(token) }).then(
      query => {
        if (query) return query.delete()
      }
    )
  }
}

test('should return status message of success upon user instance creation.', async ({ client }) => {
  const response = await client
    .post(`${urlEndPoint}/create`)
    .header('username', 'test')
    .header('password', 'password')
    .header('email', 'example@domain.host')
    .end()

  cleanUp({ user: 'test' })
  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  cleanUp({ token: response.body.token.refreshToken })
})

test('should return status message of success and token upon user login via JWT.', async ({ client }) => {
  const user = await UserModel.create({
    username: 'test',
    password: 'password',
    email: 'example@domain.host',
    role: 'user'
  })

  const response = await client
    .post(`${urlEndPoint}/jwt/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  cleanUp({ user: 'test' })
  await user.delete()
  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  cleanUp({ token: response.body.token.refreshToken })
})

test('should return status message of success and token upon user login via API.', async ({ client }) => {
  const user = await UserModel.create({
    username: 'test',
    password: 'password',
    email: 'example@domain.host',
    role: 'user'
  })

  const response = await client
    .post(`${urlEndPoint}/api/login`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  cleanUp({ user: 'test' })
  await user.delete()
  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  cleanUp({ token: response.body.token.token })
})

test('should return status message of success when jwt session user access restricted route.', async ({ client }) => {
  const user = await UserModel.create({
    username: 'test',
    password: 'password',
    email: 'example@domain.host',
    role: 'user'
  })

  const response = await client.get('/api/v1').loginVia(user, 'jwt').end()

  cleanUp({ user: 'test' })
  await user.delete()
  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})

test('should return status message of success when api session user access restricted route.', async ({ client }) => {
  const user = await UserModel.create({
    username: 'test',
    password: 'password',
    email: 'example@domain.host',
    role: 'user'
  })

  const response = await client.get('/api/v1').loginVia(user, 'api').end()

  cleanUp({ user: 'test' })
  await user.delete()
  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})

test('should return status message of success when jwt session user request for a new tokens.', async ({ client }) => {
  const user = await UserModel.create({
    username: 'test',
    password: 'password',
    email: 'example@domain.host',
    role: 'user'
  })

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

  cleanUp({ user: 'test' })
  await user.delete()
  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
  cleanUp({ token: response.body.token.refreshToken })
})

test('should return status message of success when jwt session user request for logout.', async ({ client }) => {
  const user = await UserModel.create({
    username: 'test',
    password: 'password',
    email: 'example@domain.host',
    role: 'user'
  })

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

  cleanUp({ user: 'test' })
  await user.delete()
  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})

test('should return status message of success when api session user request for logout.', async ({ client }) => {
  const user = await UserModel.create({
    username: 'test',
    password: 'password',
    email: 'example@domain.host',
    role: 'user'
  })

  const response = await client
    .delete(`${urlEndPoint}/api/logout`)
    .loginVia(user, 'api')
    .end()

  cleanUp({ user: 'test' })
  await user.delete()
  response.assertStatus(200)
  response.assertJSONSubset({ status: 'success' })
})
