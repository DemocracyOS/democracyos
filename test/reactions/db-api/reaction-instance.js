const { Types: { ObjectId } } = require('mongoose')
const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const ReactionRule = require('../../../reactions/models/reaction-rule')
const sampleReactionRule = new ReactionRule({
  method: 'LIKE',
  startingDate: new Date('2017-12-20 00:00:00'),
  closingDate: new Date('2018-02-20 00:00:00')
})

const ReactionInstance = require('../../../reactions/models/reaction-instance')
const reactionInstance = require('../../../reactions/db-api/reaction-instance')
const sampleReactionInstance = {
  reactionId: sampleReactionRule._id,
  resourceType: 'Article',
  resourceId: ObjectId('abc123abc123'),
  results: []
}

describe('db-api.reactionInstance', function () {
  describe('#create', function () {
    it('should create a reaction instance', function () {
      // require module with rewire to override its internal ReactionInstance reference
      const reactionInstance = rewire('../../../reactions/db-api/reaction-instance')

      // replace ReactionInstance constructor for a spy
      const ReactionInstanceMock = sinon.spy()

      // add a save method that only returns the data
      ReactionInstanceMock.prototype.save = function () { return Promise.resolve(sampleReactionInstance) }

      // create a spy for the save method
      const save = sinon.spy(ReactionInstanceMock.prototype, 'save')

      // override ReactionInstance inside `reactionInstance/db-api/reaction-rule`
      reactionInstance.__set__('ReactionInstance', ReactionInstanceMock)

      // call create method
      return reactionInstance.create(sampleReactionInstance)
        .then((result) => {
          sinon.assert.calledWith(ReactionInstanceMock, sampleReactionInstance)
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionInstance)
        })
    })
  })

  describe('#get', function () {
    it('should get a reactionInstance', function () {
      const ReactionInstanceMock = sinon.mock(ReactionInstance)

      ReactionInstanceMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(sampleReactionInstance)

      return reactionInstance.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          ReactionInstanceMock.verify()
          ReactionInstanceMock.restore()
          assert.equal(result, sampleReactionInstance)
        })
    })
  })

  describe('#list', function () {
    it('should list all reactionInstances', function () {
      const ReactionInstanceMock = sinon.mock(ReactionInstance)

      ReactionInstanceMock
        .expects('paginate').withArgs({}, { limit: 10, page: 1 })
        .resolves(sampleReactionInstance)

      return reactionInstance.list({ limit: 10, page: 1 })
        .then((result) => {
          ReactionInstanceMock.verify()
          ReactionInstanceMock.restore()
          assert.equal(result, sampleReactionInstance)
        })
    })
  })

  describe('#update', function () {
    it('should update a reactionInstance', function () {
      const ReactionInstanceMock = sinon.mock(ReactionInstance)
      const save = sinon.spy(() => sampleReactionInstance)

      ReactionInstanceMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return reactionInstance.update({ id: '5a5e29d948a9cc2fbeed02fa', reactionInstance: {} })
        .then((result) => {
          ReactionInstanceMock.verify()
          ReactionInstanceMock.restore()
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionInstance)
        })
    })
  })

  describe('#remove', function () {
    it('should remove a reactionInstance', function () {
      const ReactionInstanceMock = sinon.mock(ReactionInstance)
      const remove = sinon.spy()

      ReactionInstanceMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ remove })

      return reactionInstance.remove('5a5e29d948a9cc2fbeed02fa')
        .then(() => {
          ReactionInstanceMock.verify()
          ReactionInstanceMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })

  describe('#listResultsByPost', function () {
    it('should list all the reactions instances ', function () {
      const ReactionInstanceMock = sinon.mock(ReactionInstance)

      ReactionInstanceMock
        .expects('find').withArgs({ resourceId: ObjectId('abc123abc123') })
        .chain('populate', { path: 'results', populate: { path: 'userId', select: 'name _id' } })
        .chain('populate', 'reactionId')
        .resolves(sampleReactionInstance)

      return reactionInstance.listResultsByPost(ObjectId('abc123abc123'))
        .then((result) => {
          ReactionInstanceMock.verify()
          ReactionInstanceMock.restore()
          assert.equal(result, sampleReactionInstance)
        })
    })
  })

  describe('#getResult', function () {
    it('should get the result of a reaction instance', function () {
      const ReactionInstanceMock = sinon.mock(ReactionInstance)

      ReactionInstanceMock
        .expects('findOne')
        .withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('populate', { path: 'results', populate: { path: 'userId', select: 'name _id' } })
        .chain('populate', 'reactionId')
        .chain('exec')
        .resolves(sampleReactionInstance)

      return reactionInstance.getResult(ObjectId('5a5e29d948a9cc2fbeed02fa'))
        .then((result) => {
          console.log(result)
          console.log(sampleReactionInstance)
          ReactionInstanceMock.verify()
          ReactionInstanceMock.restore()
          assert.equal(result, sampleReactionInstance)
        })
    })
  })
})
