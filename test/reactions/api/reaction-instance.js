const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NO_CONTENT
} = require('http-status')
const ReactionInstance = require('../../../reactions/models/reaction-instance')
const ReactionRule = require('../../../reactions/models/reaction-rule')
const ReactionVote = require('../../../reactions/models/reaction-vote')
const User = require('../../../users/models/user')
const { fakeUser, fakeVote, fakeReactionRule, fakePost, fakeReactionInstance } = require('../../utils')

const expect = chai.expect
chai.use(chaiHttp)

const sampleUser = fakeUser('user')
const sampleVoter1 = fakeUser('user')
const sampleVoter2 = fakeUser('user')
const sampleVoter3 = fakeUser('user')
const sampleAdmin = fakeUser('admin')
const sampleRule = fakeReactionRule('LIKE')
let sampleVote1 = null
let sampleVote2 = null
let sampleVote3 = null
let sampleInstance = null
let anotherInstance = null

// Util global variables
let newUser = null
let newVoter1 = null
let newVoter2 = null
let newVoter3 = null
let newAdmin = null
let newRule = null
let newVote1 = null
let newVote2 = null
let newVote3 = null
let newInstance = null
let agent = null
let csrfToken = null

describe('/api/v1.0/reaction-instance', () => {
  before(async () => {
    await require('../../../main')
    await User.remove({})
    await ReactionRule.remove({})
    await ReactionVote.remove({})
    await ReactionInstance.remove({})
    newUser = await (new User(sampleUser)).save()
    newVoter1 = await (new User(sampleVoter1)).save()
    newVoter2 = await (new User(sampleVoter2)).save()
    newVoter3 = await (new User(sampleVoter3)).save()
    newAdmin = await (new User(sampleAdmin)).save()
    newRule = await (new ReactionRule(sampleRule)).save()
    sampleVote1 = fakeVote(newVoter1)
    sampleVote2 = fakeVote(newVoter2)
    sampleVote3 = fakeVote(newVoter3)
    newVote1 = await (new ReactionVote(sampleVote1)).save()
    newVote2 = await (new ReactionVote(sampleVote2)).save()
    newVote3 = await (new ReactionVote(sampleVote3)).save()
    sampleInstance = fakeReactionInstance(newRule, [newVote1, newVote2, newVote3])
    anotherInstance = fakeReactionInstance(newRule, [])
    newInstance = await (new ReactionInstance(sampleInstance)).save()
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
    it('GET / should NOT be able to get a list of all the reaction instances', async () => {
      await agent.get('/api/v1.0/reaction-instance')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('POST / should not be able to create a reaction instance', async () => {
      await agent.post('/api/v1.0/reaction-instance')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherInstance)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should not be able to get a reaction instance', async () => {
      await agent.get(`/api/v1.0/reaction-instance/${newInstance.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('PUT /:id should not be able to modify a reaction instance', async () => {
      let change = { method: 'NO' }
      await agent.put(`/api/v1.0/reaction-instance/${newInstance.id}`)
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
    it('DELETE /:id should not be able to delete a reaction instance', async () => {
      await agent.delete(`/api/v1.0/reaction-instance/${newInstance.id}`)
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
      await agent.get('/api/v1.0/reaction-instance')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('POST / should not be able to create a rule', async () => {
      await agent.post('/api/v1.0/reaction-instance')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherInstance)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should not be able to get a rule', async () => {
      await agent.get(`/api/v1.0/reaction-instance/${newInstance.id}`)
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
      await agent.put(`/api/v1.0/reaction-instance/${newInstance.id}`)
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
      await agent.delete(`/api/v1.0/reaction-instance/${newInstance.id}`)
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
      await agent.get('/api/v1.0/reaction-instance')
        .then((res) => {
          const { results, pagination } = res.body
          expect(res).to.have.status(OK)
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(1)
          expect(results[0]).to.have.property('title')
          expect(results[0]).to.have.property('instruction')
          expect(results[0]).to.have.property('resourceId')
          expect(results[0]).to.have.property('reactionId')
          expect(results[0]).to.have.property('results')
          expect(results[0].results).to.be.a('array')
          expect(results[0].results.length).to.be.eql(3)
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
      await agent.post('/api/v1.0/reaction-instance')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(anotherInstance)
        .then((res) => {
          expect(res).to.have.status(CREATED)
          expect(res).to.be.a('object')
          expect(res.body).to.have.property('title')
          expect(res.body).to.have.property('instruction')
          expect(res.body).to.have.property('resourceId')
          expect(res.body).to.have.property('reactionId')
          expect(res.body).to.have.property('results')
          expect(res.body.results).to.be.a('array')
          expect(res.body.results.length).to.be.eql(0)
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
    it('GET /:id should be able to get a rule', async () => {
      await agent.get(`/api/v1.0/reaction-instance/${newInstance.id}`)
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res).to.be.a('object')
          expect(res.body).to.have.property('title')
          expect(res.body).to.have.property('instruction')
          expect(res.body).to.have.property('resourceId')
          expect(res.body).to.have.property('reactionId')
          expect(res.body).to.have.property('results')
          expect(res.body.results).to.be.a('array')
          expect(res.body.results.length).to.be.eql(3)
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
    it('PUT /:id should be able to modify a rule', async () => {
      let dataChange = { title: 'A great Title' }
      await agent.put(`/api/v1.0/reaction-instance/${newInstance.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(dataChange)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res).to.be.a('object')
          expect(res.body).to.have.property('title')
          expect(res.body).to.have.property('instruction')
          expect(res.body).to.have.property('resourceId')
          expect(res.body).to.have.property('reactionId')
          expect(res.body).to.have.property('results')
          expect(res.body.results).to.be.a('array')
          expect(res.body.results.length).to.be.eql(3)
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body.title).to.be.equal(dataChange.title)
        })
        .catch((err) => {
          throw err
        })
    })
    it('DELETE /:id should be able to delete a rule', async () => {
      await agent.delete(`/api/v1.0/reaction-instance/${newInstance.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.be.equal(newInstance.id)
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
