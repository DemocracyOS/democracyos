const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const User = require('../../../users/models/user')
const user = require('../../../users/db-api/user')

const sampleUser = { username: 'USERNAME' }

describe('db-api.users', () => {
  describe('#create', () => {
    it('should create a user', () => {
      // require module with rewire to override its internal User reference
      const user = rewire('users/db-api/user')

      // replace User constructor for a spy
      const UserMock = sinon.spy()

      // add a save method that only returns the data
      UserMock.prototype.save = () => { return Promise.resolve(sampleUser) }

      // create a spy for the save method
      const save = sinon.spy(UserMock.prototype, 'save')

      // override User inside `user/db-api/user`
      user.__set__('User', UserMock)

      // call create method
      return user.create(sampleUser)
        .then((result) => {
          sinon.assert.calledWith(UserMock, sampleUser)
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleUser)
        })
    })
  })

  describe('#get', () => {
    it('should get a user', () => {
      const UserMock = sinon.mock(User)

      UserMock
        .expects('find').withArgs({ _id: 'ID' })
        .chain('exec')
        .resolves(sampleUser)

      return user.get('ID')
        .then((result) => {
          UserMock.verify()
          UserMock.restore()
          assert.equal(result, sampleUser)
        })
    })
  })

  describe('#list', () => {
    it('should list all users', () => {
      const UserMock = sinon.mock(User)

      UserMock
        .expects('paginate').withArgs({}, { limit: 10, page: 1 })
        .resolves(sampleUser)

      return user.list({ limit: 10, page: 1 })
        .then((result) => {
          UserMock.verify()
          UserMock.restore()
          assert.equal(result, sampleUser)
        })
    })
  })

  describe('#update', () => {
    it('should update a user', () => {
      const UserMock = sinon.mock(User)
      const save = sinon.spy(() => sampleUser)

      UserMock
        .expects('find').withArgs({ _id: 'ID' })
        .chain('exec')
        .resolves({ save })

      return user.update({ id: 'ID', user: {} })
        .then((result) => {
          UserMock.verify()
          UserMock.restore()
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleUser)
        })
    })
  })

  describe('#remove', () => {
    it('should remove a user', () => {
      const UserMock = sinon.mock(User)
      const remove = sinon.spy()

      UserMock
        .expects('find').withArgs({ _id: 'ID' })
        .chain('exec')
        .resolves({ remove })

      return user.remove('ID')
        .then(() => {
          UserMock.verify()
          UserMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })
})
