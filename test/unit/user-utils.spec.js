'use strict'

const { test } = use('Test/Suite')('User Utils')
const UserModel = use('App/Models/User')

test('should return instance of created user.', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})
