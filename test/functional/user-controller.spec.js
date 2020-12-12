'use strict'

const { test, trait } = use('Test/Suite')('User Controller')
const UserModel = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

const urlEndPoint = '/api/v1/user'

test('should return status message of success upon user instance creation.', async ({ client }) => {
  const response = await client
    .post(`${urlEndPoint}/create`)
    .header('username', 'test')
    .header('password', 'password')
    .end()

  await UserModel.first().then(query => query.delete())

  response.assertStatus(201)
  response.assertJSONSubset({ status: 'success' })
})
