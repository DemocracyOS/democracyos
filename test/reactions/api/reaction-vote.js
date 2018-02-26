const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionVote = require('../../../reactions/models/reaction-vote')
const User = require('../../../users/models/user')

const sampleUser = new User({
  username: 'testingUser'
})

const anotherUser = new User({
  username: 'testingUser2'
})

const otherUser = new User({
  username: 'testingUser3'
})

const sampleReactionVote = {
  userId: sampleUser._id,
  value: 'LIKE'
}

const anotherReactionVote = {
  userId: anotherUser._id,
  value: 'LIKE'
}

const otherReactionVote = {
  userId: otherUser._id,
  value: 'LIKE'
}

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/reaction-vote', () => {
  before(async () => {
    await require('../../../main')
  })

  beforeEach(async () => {
    await ReactionVote.remove({})
  })

  describe('#post', () => {
    it('should create a reaction vote', async () => {
      const res = await chai.request('http://localhost:3000')
        .post('/api/v1.0/reaction-vote')
        .send(sampleReactionVote)

      expect(res).to.have.status(CREATED)
    })
  })

  describe('#list', () => {
    it('should list all reaction votes', async () => {
      await (new ReactionVote(sampleReactionVote)).save()
      await (new ReactionVote(anotherReactionVote)).save()
      await (new ReactionVote(otherReactionVote)).save()

      const res = await chai.request('http://localhost:3000')
        .get('/api/v1.0/reaction-vote')
        .query({ limit: 10, page: 1 })

      expect(res).to.have.status(OK)

      const { results, pagination } = res.body

      expect(results).to.be.a('array')
      expect(results.length).to.be.eql(3)
      expect(pagination).to.have.property('count')
      expect(pagination).to.have.property('page')
      expect(pagination).to.have.property('limit')
    })
  })

  describe('#get', () => {
    it('should get a reaction vote by id', async () => {
      let newReactionVote = await (new ReactionVote(sampleReactionVote)).save()
      const res = await chai.request('http://localhost:3000')
        .get(`/api/v1.0/reaction-vote/${newReactionVote.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      // Check if the response contains all the properties of the object
      let properties = Object.keys(sampleReactionVote)
      properties.map((prop) => expect(res.body).to.have.property(prop))
    })
  })

  describe('#put', () => {
    it('should update a reaction vote', async () => {
      let newReactionVote = await (new ReactionVote(sampleReactionVote)).save()
      const res = await chai.request('http://localhost:3000')
        .put(`/api/v1.0/reaction-vote/${newReactionVote.id}`)
        .send(Object.assign(sampleReactionVote, { value: 12345 }))

      expect(res).to.have.status(OK)
    })
  })

  describe('#delete', () => {
    it('should remove a reaction vote', async () => {
      let newReactionVote = await (new ReactionVote(sampleReactionVote)).save()
      const res = await chai.request('http://localhost:3000')
        .delete(`/api/v1.0/reaction-vote/${newReactionVote.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('id')
    })
  })
})
