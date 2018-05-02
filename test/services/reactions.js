const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')

const ObjectID = require('mongodb').ObjectID

const User = require('../../users/models/user')
const sampleUsers = [
  {
    username: 'Jonhco',
    name: 'Jonh Cork',
    bio: 'test bio',
    email: 'jonh@te.st'
  },
  {
    username: 'JennyT',
    name: 'Jenny Terry',
    bio: 'test bio',
    email: 'jennyt@te.st'
  },
  {
    username: 'Markovz',
    name: 'Mar Kovic',
    bio: 'test bio',
    email: 'marjovz@te.st'
  },
  {
    username: 'maripet',
    name: 'Peter Mari',
    bio: 'test bio',
    email: 'maripet@te.st'
  }
]

const ReactionVote = require('../../reactions/models/reaction-vote')

const ReactionRule = require('../../reactions/models/reaction-rule')

const ReactionInstance = require('../../reactions/models/reaction-instance')

const expect = chai.expect
chai.use(chaiHttp)

let users = []
let votes = []
let reactionRules = []
let reactionInstances = []
const resourceId = 'abc123abc123'
let fakeResourceId = ObjectID(resourceId)

describe('/api/v1.0/services/reactions', () => {
  before(async () => {
    await require('../../main')
  })

  beforeEach(async () => {
    users = []
    votes = []
    reactionRules = []
    reactionInstances = []
    // Clean db
    await ReactionInstance.remove({})
    await ReactionRule.remove({})
    await ReactionVote.remove({})
    await User.remove({})
    // Populate DB
    users[0] = await (new User(sampleUsers[0])).save()
    users[1] = await (new User(sampleUsers[1])).save()
    users[2] = await (new User(sampleUsers[2])).save()
    users[3] = await (new User(sampleUsers[3])).save()
    votes[0] = await (new ReactionVote({
      userId: users[0]._id,
      value: 'LIKE'
    })).save()
    votes[1] = await (new ReactionVote({
      userId: users[1]._id,
      value: 'LIKE'
    })).save()
    votes[2] = await (new ReactionVote({
      userId: users[2]._id,
      value: 'LIKE'
    })).save()
    votes[3] = await (new ReactionVote({
      userId: users[3]._id,
      value: 'LIKE'
    })).save()
    votes[4] = await (new ReactionVote({
      userId: users[0]._id,
      value: 'LIKE'
    })).save()
    votes[5] = await (new ReactionVote({
      userId: users[1]._id,
      value: 'LIKE'
    })).save()
    reactionRules[0] = await (new ReactionRule({
      method: 'LIKE',
      name: 'Audition',
      limit: '5',
      startingDate: new Date('2017-12-20 00:00:00'),
      closingDate: new Date('2018-02-20 00:00:00')
    })).save()
    reactionRules[1] = await (new ReactionRule({
      method: 'LIKE',
      name: 'Congress',
      limit: '2',
      startingDate: new Date('2017-12-20 00:00:00'),
      closingDate: new Date('2018-02-20 00:00:00')
    })).save()
    reactionInstances[0] = await (new ReactionInstance({
      reactionId: reactionRules[0]._id,
      resourceType: 'Content',
      resourceId: fakeResourceId,
      results: [
        votes[0]._id,
        votes[1]._id,
        votes[2]._id,
        votes[3]._id
      ]
    })).save()
    reactionInstances[1] = await (new ReactionInstance({
      reactionId: reactionRules[1]._id,
      resourceType: 'Content',
      resourceId: fakeResourceId,
      results: [
        votes[4]._id,
        votes[5]._id
      ]
    })).save()
  })

  // describe('#list', () => {
  //   it('should list all the results from all the reaction instances (2) of a post', async () => {

  //     const res = await chai.request('http://localhost:3000')
  //       .get('/api/v1.0/services/reactions/posts/' + resourceId + '/results')
  //       .query()

  //     expect(res).to.have.status(OK)

  //     const results = res.body

  //     expect(results).to.be.a('array')
  //     expect(results.length).to.be.eql(2)
  //     results.forEach((result) => {
  //       expect(result).to.be.an('object')
  //       expect(result).to.have.property('id')
  //       expect(result).to.have.property('reactionRule')
  //       expect(result).to.have.property('data')
  //       expect(result).to.have.property('participants')
  //       expect(result.participants).to.be.a('array')
  //       expect(result.participants.length).to.be.at.least(2)
  //       expect(result.participants[0]).to.have.property('_id')
  //       expect(result.participants[0]).to.have.property('name')
  //       expect(result.data).to.be.an('object')
  //       expect(result.data).to.have.property('name')
  //       expect(result.data.name).to.be.eql('LIKE')
  //       expect(result.data).to.have.property('value')
  //       expect(result.data.value).to.be.at.least(2)
  //     })
  //   })
  // })

  // describe('#getResult', () => {
  //   it('should get the results from a reaction instances', async () => {

  //     const res = await chai.request('http://localhost:3000')
  //       .get('/api/v1.0/services/reactions/' + reactionInstances[0]._id + '/result')
  //       .query()

  //     expect(res).to.have.status(OK)

  //     const result = res.body

  //     // Expects for a result
  //     expect(result).to.be.an('object')
  //     expect(result).to.have.property('id')
  //     expect(result).to.have.property('reactionRule')
  //     expect(result).to.have.property('data')
  //     expect(result).to.have.property('participants')
  //     expect(result.participants).to.be.a('array')
  //     expect(result.participants.length).to.be.eql(4)
  //     expect(result.participants[0]).to.have.property('_id')
  //     expect(result.participants[0]).to.have.property('name')
  //     expect(result.data).to.be.an('object')
  //     expect(result.data).to.have.property('name')
  //     expect(result.data.name).to.be.eql('LIKE')
  //     expect(result.data).to.have.property('value')
  //     expect(result.data.value).to.be.eql(4)
  //   })
  // })
})
