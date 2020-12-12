module.exports = UserModel => {
  const withReferences = references => {
    const User = UserModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => User.with(reference))
    }

    return User
  }

  return {
    createNewDevice: ({ response, auth, role, u_id, uuidv4 }) => {
      const uuid = uuidv4()

      if (role !== 'user') {
        return response.status(403).send({
          status: 'failed',
          message: 'Access denied. only user can add devices.'
        })
      }

      return UserModel.create({
        u_id: uuid,
        role: 'device',
        auth_id: uuid,
        owner: u_id
      }).then(device => [device, auth.authenticator('api').generate(device)])
    }
  }
}
