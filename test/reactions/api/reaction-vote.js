const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NO_CONTENT
} = require('http-status')
const ReactionVote = require('../../../reactions/models/reaction-vote')
const User = require('../../../users/models/user')
const { fakeUser, fakeVote } = require('../../utils')

const expect = chai.expect
chai.use(chaiHttp)

const sampleUser = fakeUser('user')
const sampleVoter = fakeUser('user')
const sampleAdmin = fakeUser('admin')
let sampleVote = null
let anotherVote = null

// Util global variables
let newVoter = null
let newUser = null
let newAdmin = null
let newVote = null
let agent = null
let csrfToken = null

describe('/api/v1.0/reaction-vote', () => {
  before(async () => {
    await require('../../../main')
    await User.remove({})
    await ReactionVote.remove({})
    newVoter = await (new User(sampleVoter)).save()
    newUser = await (new User(sampleUser)).save()
    newAdmin = await (new User(sampleAdmin)).save()
    sampleVote = fakeVote(newVoter)
    anotherVote = fakeVote(newVoter)
    newVote = await (new ReactionVote(sampleVote)).save()
  })

  describe('As Anonymous', () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('GET / should NOT be able to get a list of all the votes', async () => {
      await agent.get('/api/v1.0/reaction-vote')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('POST / should not be able to create a vote', async () => {
      await agent.post('/api/v1.0/reaction-vote')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherVote)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should not be able to get a vote', async () => {
      await agent.get(`/api/v1.0/reaction-vote/${newVote.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('PUT /:id should not be able to modify a vote', async () => {
      let change = {method: 'NO'}
      await agent.put(`/api/v1.0/reaction-vote/${newVote.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(change)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('DELETE /:id should not be able to delete a vote', async () => {
      await agent.delete(`/api/v1.0/reaction-vote/${newVote.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
  })

  describe('As Logged user', () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('should log in', async () => {
      await agent.post('/auth/signin')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: newUser.email })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('success')
          expect(res.body.success).to.be.equal(true)
        })
        .catch((err) => {
          throw err
        })
    })
    it('the session should have a user object', async () => {
      await agent.get('/auth/session')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body.user).to.be.a('object')
          expect(res.body.user).to.have.property('name')
        })
        .catch((err) => {
          throw err
        })
    })
    it('GET / should not be able to get a list of all the votes', async () => {
      await agent.get('/api/v1.0/reaction-vote')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('POST / should not be able to create a vote', async () => {
      await agent.post('/api/v1.0/reaction-vote')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherVote)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should not be able to get a vote', async () => {
      await agent.get(`/api/v1.0/reaction-vote/${newVote.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('PUT /:id should not be able to modify a vote', async () => {
      let change = { method: 'NO' }
      await agent.put(`/api/v1.0/reaction-vote/${newVote.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(change)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('DELETE /:id should not be able to delete a vote', async () => {
      await agent.delete(`/api/v1.0/reaction-vote/${newVote.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
  })
  describe('As an admin user', () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('should log in', async () => {
      await agent.post('/auth/signin')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: newAdmin.email })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('success')
          expect(res.body.success).to.be.equal(true)
        })
        .catch((err) => {
          throw err
        })
    })
    it('the session should have a user object', async () => {
      await agent.get('/auth/session')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.a('object')
          expect(res.body.user).to.be.a('object')
          expect(res.body.user).to.have.property('name')
        })
        .catch((err) => {
          throw err
        })
    })
    it('GET / should be able to get a list of all the votes', async () => {
      await agent.get('/api/v1.0/reaction-vote')
        .then((res) => {
          const { results, pagination } = res.body
          expect(res).to.have.status(OK)
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(1)
          expect(results[0]).to.have.property('userId')
          expect(results[0]).to.have.property('meta')
          expect(results[0].meta).to.have.property('timesVoted')
          expect(results[0].meta).to.have.property('deleted')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.have.property('updatedAt')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          throw err
        })
    })
    it('POST / should not be able to create a vote', async () => {
      await agent.post('/api/v1.0/reaction-vote')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherVote)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to get a vote', async () => {
      await agent.get(`/api/v1.0/reaction-vote/${newVote.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('userId')
          expect(res.body).to.have.property('meta')
          expect(res.body.meta).to.have.property('timesVoted')
          expect(res.body.meta).to.have.property('deleted')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
    it('PUT /:id should not be able to modify a vote', async () => {
      let change = { userId: 'Dont change data!' }
      await agent.put(`/api/v1.0/reaction-vote/${newVote.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(change)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('DELETE /:id should not be able to delete a vote', async () => {
      await agent.delete(`/api/v1.0/reaction-vote/${newVote.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
  })
})
