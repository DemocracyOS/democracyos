const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NO_CONTENT
} = require('http-status')
const ReactionRule = require('../../../reactions/models/reaction-rule')
const User = require('../../../users/models/user')
const { fakeUser, fakeReactionRule } = require('../../utils')

const expect = chai.expect
chai.use(chaiHttp)

const sampleUser = fakeUser('user')
const sampleAdmin = fakeUser('admin')
const sampleRule = fakeReactionRule('LIKE')
const anotherRule = fakeReactionRule('LIKE')
// const sampleVoter = fakeUser('user')
// let sampleVote = null
// let anotherVote = null

// Util global variables
let newUser = null
let newAdmin = null
let newRule = null
let agent = null
let csrfToken = null

describe('/api/v1.0/reaction-rule', () => {
  before(async () => {
    await require('../../../main')
    await User.remove({})
    await ReactionRule.remove({})
    newUser = await (new User(sampleUser)).save()
    newAdmin = await (new User(sampleAdmin)).save()
    newRule = await (new ReactionRule(sampleRule)).save()
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
    it('GET / should NOT be able to get a list of all the rules', async () => {
      await agent.get('/api/v1.0/reaction-rule')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('POST / should not be able to create a rule', async () => {
      await agent.post('/api/v1.0/reaction-rule')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherRule)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should not be able to get a rule', async () => {
      await agent.get(`/api/v1.0/reaction-rule/${newRule.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('PUT /:id should not be able to modify a rule', async () => {
      let change = { method: 'NO' }
      await agent.put(`/api/v1.0/reaction-rule/${newRule.id}`)
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
    it('DELETE /:id should not be able to delete a rule', async () => {
      await agent.delete(`/api/v1.0/reaction-rule/${newRule.id}`)
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
    it('GET / should not be able to get a list of all the rules', async () => {
      await agent.get('/api/v1.0/reaction-rule')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('POST / should not be able to create a rule', async () => {
      await agent.post('/api/v1.0/reaction-rule')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherRule)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should not be able to get a rule', async () => {
      await agent.get(`/api/v1.0/reaction-rule/${newRule.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('PUT /:id should not be able to modify a rule', async () => {
      let change = { method: 'NO' }
      await agent.put(`/api/v1.0/reaction-rule/${newRule.id}`)
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
    it('DELETE /:id should not be able to delete a rule', async () => {
      await agent.delete(`/api/v1.0/reaction-rule/${newRule.id}`)
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
    it('GET / should be able to get a list of all the rules', async () => {
      await agent.get('/api/v1.0/reaction-rule')
        .then((res) => {
          const { results, pagination } = res.body
          expect(res).to.have.status(OK)
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(1)
          expect(results[0]).to.have.property('startingDate')
          expect(results[0]).to.have.property('closingDate')
          expect(results[0]).to.have.property('method')
          expect(results[0]).to.have.property('name')
          expect(results[0]).to.have.property('limit')
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
    it('POST / should be able to create a rule', async () => {
      await agent.post('/api/v1.0/reaction-rule')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherRule)
        .then((res) => {
          expect(res).to.have.status(CREATED)
          expect(res).to.be.a('object')
          expect(res.body).to.have.property('method')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('limit')
          expect(res.body).to.have.property('startingDate')
          expect(res.body).to.have.property('closingDate')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
    it('GET /:id should be able to get a rule', async () => {
      await agent.get(`/api/v1.0/reaction-rule/${newRule.id}`)
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.be.a('object')
          expect(res.body).to.have.property('startingDate')
          expect(res.body).to.have.property('closingDate')
          expect(res.body).to.have.property('method')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('limit')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
    it('PUT /:id should be able to modify a rule', async () => {
      await agent.put(`/api/v1.0/reaction-rule/${newRule.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherRule)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res).to.be.a('object')
          expect(res.body).to.have.property('startingDate')
          expect(res.body).to.have.property('closingDate')
          expect(res.body).to.have.property('method')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('limit')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')        
          expect(res.body.name).to.not.be.equal(sampleRule.name)
          expect(res.body.name).to.be.equal(anotherRule.name)
          expect((new Date(res.body.startingDate)).toUTCString()).to.not.be.equal((new Date(sampleRule.startingDate)).toUTCString())
          expect((new Date(res.body.startingDate)).toUTCString()).to.be.equal((new Date(anotherRule.startingDate)).toUTCString())
        })
        .catch((err) => {
          throw err
        })
    })
    it('DELETE /:id should be able to delete a rule', async () => {
      await agent.delete(`/api/v1.0/reaction-rule/${newRule.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.be.equal(newRule.id)
        })
        .catch((err) => {
          throw err
        })
    })
  })
})