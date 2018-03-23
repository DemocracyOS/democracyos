const { Types: { ObjectId } } = require('mongoose')
const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const ReactionRule = require('../../../reactions/models/reaction-rule')
const reactionRule = require('../../../reactions/db-api/reaction-rule')
const sampleReactionRule = {
  name: 'MyReactionConfig',
  method: 'LIKE',
  startingDate: new Date('2017-12-20 00:00:00'),
  closingDate: new Date('2018-02-20 00:00:00'),
  limit: 5,
  options: {}
}

describe('db-api.reactionRule', function () {
  describe('#create', function () {
    it('should create a reaction rule', function () {
    // require module with rewire to override its internal ReactionRule reference
      const reactionRule = rewire('../../../reactions/db-api/reaction-rule')

      // replace ReactionRule constructor for a spy
      const ReactionRuleMock = sinon.spy()

      // add a save method that only returns the data
      ReactionRuleMock.prototype.save = function () { return Promise.resolve(sampleReactionRule) }

      // create a spy for the save method
      const save = sinon.spy(ReactionRuleMock.prototype, 'save')

      // override ReactionRule inside `reactionRule/db-api/reaction-rule`
      reactionRule.__set__('ReactionRule', ReactionRuleMock)

      // call create method
      return reactionRule.create(sampleReactionRule)
        .then((result) => {
          sinon.assert.calledWithNew(ReactionRuleMock)
          sinon.assert.calledWith(ReactionRuleMock, sampleReactionRule)
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionRule)
        })
    })
  })

  describe('#get', function () {
    it('should get a reactionRule', function () {
      const ReactionRuleMock = sinon.mock(ReactionRule)

      ReactionRuleMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(sampleReactionRule)

      return reactionRule.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          ReactionRuleMock.verify()
          ReactionRuleMock.restore()
          assert.equal(result, sampleReactionRule)
        })
    })
  })

  describe('#getOneByName', function () {
    it('should get a reactionRule by a specific name', function () {
      const ReactionRuleMock = sinon.mock(ReactionRule)

      ReactionRuleMock
        .expects('findOne').withArgs({ name: 'MyReactionConfig' })
        .chain('exec')
        .resolves(sampleReactionRule)

      return reactionRule.getByName('MyReactionConfig')
        .then((result) => {
          ReactionRuleMock.verify()
          ReactionRuleMock.restore()
          assert.equal(result, sampleReactionRule)
        })
    })
  })

  describe('#listByName', function () {
    it('should list all reactionRules by a partial name', function () {
      const ReactionRuleMock = sinon.mock(ReactionRule)

      ReactionRuleMock
        .expects('paginate').withArgs({ name: { $regex: 'mYrEaCtIo', $options: 'i' } }, { limit: 10, page: 1 })
        .resolves(sampleReactionRule)

      return reactionRule.listByName({ name: 'mYrEaCtIo', limit: 10, page: 1 })
        .then((result) => {
          ReactionRuleMock.verify()
          ReactionRuleMock.restore()
          assert.equal(result, sampleReactionRule)
        })
    })
  })

  describe('#list', function () {
    it('should list all reactionRules', function () {
      const ReactionRuleMock = sinon.mock(ReactionRule)

      ReactionRuleMock
        .expects('paginate').withArgs({}, { limit: 10, page: 1 })
        .resolves(sampleReactionRule)

      return reactionRule.list({ limit: 10, page: 1 })
        .then((result) => {
          ReactionRuleMock.verify()
          ReactionRuleMock.restore()
          assert.equal(result, sampleReactionRule)
        })
    })
  })

  describe('#update', function () {
    it('should update a reactionRule', function () {
      const ReactionRuleMock = sinon.mock(ReactionRule)
      const save = sinon.spy(() => sampleReactionRule)

      ReactionRuleMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return reactionRule.update({ id: '5a5e29d948a9cc2fbeed02fa', reactionRule: {} })
        .then((result) => {
          ReactionRuleMock.verify()
          ReactionRuleMock.restore()
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionRule)
        })
    })
  })

  describe('#remove', function () {
    it('should remove a reactionRule', function () {
      const ReactionRuleMock = sinon.mock(ReactionRule)
      const remove = sinon.spy()

      ReactionRuleMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ remove })

      return reactionRule.remove('5a5e29d948a9cc2fbeed02fa')
        .then(() => {
          ReactionRuleMock.verify()
          ReactionRuleMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })
})
