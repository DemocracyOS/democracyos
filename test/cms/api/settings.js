const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  BAD_REQUEST
} = require('http-status')
const Setting = require('../../../cms/models/setting')
const User = require('../../../users/models/user')
const { fakeUser, fakeSetting } = require('../../utils')

const expect = chai.expect
chai.use(chaiHttp)

const sampleUser = fakeUser('user')
const sampleAdmin = fakeUser('admin')
const sampleSetting = fakeSetting('admin')
const samplePostSetting = fakeSetting('admin')
// Util global variables
let newUser = null
let newAdmin = null
let newSetting = null
let agent = null
let csrfToken = null

describe('/api/v1.0/settings', () => {
  before(async () => {
    await require('../../../main')
    await User.remove({})
    await Setting.remove({})
    newUser = await (new User(sampleUser)).save()
    newAdmin = await (new User(sampleAdmin)).save()
    newSetting = await (new Setting(sampleSetting)).save()
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
    it('GET / should be able to access settings', async () => {
      await agent.get('/api/v1.0/settings')
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('communityName')
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('POST / should not be able to create a setting', async () => {
      await agent.post('/api/v1.0/settings')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(samplePostSetting)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to access a setting', async () => {
      await agent.get(`/api/v1.0/settings/${newSetting.id}`)
        .query({ limit: 10, page: 1 })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('communityName')
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('PUT /:id should not be able to create a setting', async () => {
      await agent.put(`/api/v1.0/settings/${newSetting.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('DELETE /:id should not be able to delete a setting', async () => {
      await agent.delete(`/api/v1.0/settings/${newSetting.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          // Should get a FORBIDDEN
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
    it('GET / should be able to access the list of settings', async () => {
      await agent.get('/api/v1.0/settings')
        .query({ limit: 10, page: 1 })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('communityName')
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          throw err
        })
    })
    it('POST / should not be able to create a setting', async () => {
      await agent.post('/api/v1.0/settings')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(samplePostSetting)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to access a setting', async () => {
      await agent.get(`/api/v1.0/settings/${newSetting.id}`)
        .query({ limit: 10, page: 1 })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('communityName')
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('PUT /:id should not be able to create a setting', async () => {
      await agent.put(`/api/v1.0/settings/${newSetting.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('DELETE /:id should not be able to delete a setting', async () => {
      await agent.delete(`/api/v1.0/settings/${newSetting.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          // Should get a FORBIDDEN
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

    it('GET / should be able to access the list of settings', async () => {
      await agent.get('/api/v1.0/settings')
        .query({ limit: 10, page: 1 })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('communityName')
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          throw err
        })
    })
    it('POST / should return an error if a setting is already created', async () => {
      await agent.post('/api/v1.0/settings')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(samplePostSetting)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          expect(err).to.have.status(BAD_REQUEST)
          expect(err).to.have.property('message')
          expect(err.message).to.be.eql('Bad Request')
        })
    })
    it('GET /:id should be able to access a setting', async () => {
      await agent.get(`/api/v1.0/settings/${newSetting.id}`)
        .query({ limit: 10, page: 1 })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('communityName')
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('PUT /:id should be able to modify a setting', async () => {
      let newCommunityName = 'Awesome Community'
      await agent.put(`/api/v1.0/settings/${newSetting.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ communityName: newCommunityName })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('communityName')
          expect(res.body.communityName).to.be.equal(newCommunityName)
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('DELETE /:id should be able to delete a setting', async () => {
      await agent.delete(`/api/v1.0/settings/${newSetting.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          expect(res).to.have.status(OK)
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
  })
})
