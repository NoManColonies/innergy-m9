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
    await UserModel.findBy({ username: user }).then(
      query => !!query && query.delete()
    )
  }
  if (token) {
    await TokenModel.findBy({ token: await Encryption.decrypt(token) }).then(
      query => !!query && query.delete()
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
})
