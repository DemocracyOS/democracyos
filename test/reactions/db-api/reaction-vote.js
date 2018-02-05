const { Types: { ObjectId } } = require('mongoose')
const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const User = require('../../../users/models/user')
const sampleUser = new User({
  username: 'testingUser'
})

const ReactionVote = require('../../../reactions/models/reaction-vote')
const reactionVote = require('../../../reactions/db-api/reaction-vote')
const sampleReactionVote = {
  userId: sampleUser._id,
  value: 'My test value'
}

describe('db-api.reactionVote', function () {
  describe('#create', function () {
    it('should create a reaction vote', function () {
    // require module with rewire to override its internal ReactionVote reference
      const reactionVote = rewire('../../../reactions/db-api/reaction-vote')

      // replace ReactionVote constructor for a spy
      const ReactionVoteMock = sinon.spy()

      // add a save method that only returns the data
      ReactionVoteMock.prototype.save = function () { return Promise.resolve(sampleReactionVote) }

      // create a spy for the save method
      const save = sinon.spy(ReactionVoteMock.prototype, 'save')

      // override ReactionVote inside `reactionVote/db-api/reaction-rule`
      reactionVote.__set__('ReactionVote', ReactionVoteMock)

      // call create method
      return reactionVote.create(sampleReactionVote)
        .then((result) => {
          sinon.assert.calledWith(ReactionVoteMock, sampleReactionVote)
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionVote)
        })
    })
  })

  describe('#get', function () {
    it('should get a reactionVote', function () {
      const ReactionVoteMock = sinon.mock(ReactionVote)

      ReactionVoteMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(sampleReactionVote)

      return reactionVote.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          ReactionVoteMock.verify()
          ReactionVoteMock.restore()
          assert.equal(result, sampleReactionVote)
        })
    })
  })

  describe('#list', function () {
    it('should list all reactionVotes', function () {
      const ReactionVoteMock = sinon.mock(ReactionVote)

      ReactionVoteMock
        .expects('paginate').withArgs({}, { limit: 10, page: 1 })
        .resolves(sampleReactionVote)

      return reactionVote.list({ limit: 10, page: 1 })
        .then((result) => {
          ReactionVoteMock.verify()
          ReactionVoteMock.restore()
          assert.equal(result, sampleReactionVote)
        })
    })
  })

  describe('#update', function () {
    it('should update a reactionVote', function () {
      const ReactionVoteMock = sinon.mock(ReactionVote)
      const save = sinon.spy(() => sampleReactionVote)

      ReactionVoteMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return reactionVote.update({ id: '5a5e29d948a9cc2fbeed02fa', reactionVote: {} })
        .then((result) => {
          ReactionVoteMock.verify()
          ReactionVoteMock.restore()
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleReactionVote)
        })
    })
  })

  describe('#remove', function () {
    it('should remove a reactionVote', function () {
      const ReactionVoteMock = sinon.mock(ReactionVote)
      const remove = sinon.spy()

      ReactionVoteMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ remove })

      return reactionVote.remove('5a5e29d948a9cc2fbeed02fa')
        .then(() => {
          ReactionVoteMock.verify()
          ReactionVoteMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })
})
