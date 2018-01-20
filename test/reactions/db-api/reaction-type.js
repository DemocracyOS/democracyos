const { Types: { ObjectId } } = require('mongoose')
const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const ReactionType = require('../../../reactions/models/reaction-type')
const reactionType = require('../../../reactions/db-api/reaction-type')
const sampleReactionType = {
  method: 'LIKE',
  startingDate: new Date('2017-12-20 00:00:00'),
  closingDate: new Date('2018-02-20 00:00:00')
}

describe('db-api.reactionType', function () {
  describe('#create', function () {
    it('should create a reaction type', function () {
    // require module with rewire to override its internal ReactionType reference
      const reactionType = rewire('../../../reactions/db-api/reaction-type')

      // replace ReactionType constructor for a spy
      const ReactionTypeMock = sinon.spy()

      // add a save method that only returns the data
      ReactionTypeMock.prototype.save = function () { return Promise.resolve(sampleReactionType) }

      // create a spy for the save method
      const save = sinon.spy(ReactionTypeMock.prototype, 'save')

      // override ReactionType inside `reactionType/db-api/reaction-type`
      reactionType.__set__('ReactionType', ReactionTypeMock)

      // call create method
      return reactionType.create(sampleReactionType)
        .then((result) => {
          sinon.assert.calledWithNew(ReactionTypeMock)
          sinon.assert.calledWith(ReactionTypeMock, sampleReactionType)
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionType)
        })
    })
  })

  describe('#get', function () {
    it('should get a reactionType', function () {
      const ReactionTypeMock = sinon.mock(ReactionType)

      ReactionTypeMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(sampleReactionType)

      return reactionType.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          ReactionTypeMock.verify()
          ReactionTypeMock.restore()
          assert.equal(result, sampleReactionType)
        })
    })
  })

  describe('#list', function () {
    it('should list all reactionTypes', function () {
      const ReactionTypeMock = sinon.mock(ReactionType)

      ReactionTypeMock
        .expects('paginate').withArgs({}, { limit: 10, page: 1 })
        .resolves(sampleReactionType)

      return reactionType.list({ limit: 10, page: 1 })
        .then((result) => {
          ReactionTypeMock.verify()
          ReactionTypeMock.restore()
          assert.equal(result, sampleReactionType)
        })
    })
  })

  describe('#update', function () {
    it('should update a reactionType', function () {
      const ReactionTypeMock = sinon.mock(ReactionType)
      const save = sinon.spy(() => sampleReactionType)

      ReactionTypeMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return reactionType.update({ id: '5a5e29d948a9cc2fbeed02fa', reactionType: {} })
        .then((result) => {
          ReactionTypeMock.verify()
          ReactionTypeMock.restore()
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionType)
        })
    })
  })

  describe('#remove', function () {
    it('should remove a reactionType', function () {
      const ReactionTypeMock = sinon.mock(ReactionType)
      const remove = sinon.spy()

      ReactionTypeMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ remove })

      return reactionType.remove('5a5e29d948a9cc2fbeed02fa')
        .then(() => {
          ReactionTypeMock.verify()
          ReactionTypeMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })
})
