const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')

const User = require('../../../users/models/user')
const user = require('../../../users/db-api/user')

const sampleUser = { username: 'USERNAME' }

describe('db-api.users', () => {
  it('should #create a user', () => {
    // require module with rewire to override its internal User reference
    const user = rewire('../../../users/db-api/user')

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
        sinon.assert.calledWithNew(UserMock)
        sinon.assert.calledWith(UserMock, sampleUser)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(sampleUser)
      })
  })
  it('should #get a user', () => {
    const UserMock = sinon.mock(User)

    UserMock
      .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
      .chain('exec')
      .resolves(sampleUser)

    return user.get({ id: '5a5e29d948a9cc2fbeed02fa' })
      .then((result) => {
        UserMock.verify()
        UserMock.restore()
        expect(result).to.equal(sampleUser)
      })
  })
  it('should #list all users', () => {
    const UserMock = sinon.mock(User)

    UserMock
      .expects('paginate').withArgs({}, { select: {}, limit: 10, page: 1 })
      .resolves(sampleUser)

    return user.list({ limit: 10, page: 1, fields: {} })
      .then((result) => {
        UserMock.verify()
        UserMock.restore()
        expect(result).to.equal(sampleUser)
      })
  })
  it('should #update a user', () => {
    const UserMock = sinon.mock(User)
    const save = sinon.spy(() => sampleUser)

    UserMock
      .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
      .chain('exec')
      .resolves({ save })

    return user.update({ id: '5a5e29d948a9cc2fbeed02fa', user: {} })
      .then((result) => {
        UserMock.verify()
        UserMock.restore()
        sinon.assert.calledOnce(save)
        expect(result).to.equal(sampleUser)
      })
  })
  it('should #remove a user', () => {
    const UserMock = sinon.mock(User)
    const remove = sinon.spy()

    UserMock
      .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
      .chain('exec')
      .resolves({ remove })

    return user.remove('5a5e29d948a9cc2fbeed02fa')
      .then(() => {
        UserMock.verify()
        UserMock.restore()
        sinon.assert.calledOnce(remove)
      })
  })
})
