const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NO_CONTENT
} = require('http-status')
const Post = require('../../../cms/models/post')
const User = require('../../../users/models/user')
const { fakeUser, fakePost } = require('../../utils')

const sampleUser = fakeUser('user')
const sampleAdmin = fakeUser('admin')
let samplePost1 = null
let samplePost2 = null
let samplePost3 = null
let samplePost4 = null
let samplePost5 = null
let newPost = null

const expect = chai.expect
chai.use(chaiHttp)

let newUser = null
let newAdmin = null
let newPost1 = null
/* eslint-disable no-unused-vars */
let newPost2 = null
let newPost3 = null
let newPost4 = null
let newPost5 = null
let agent = null
let csrfToken = null

describe('/api/v1.0/posts', () => {
  // before(async () => {
  //   await require('../../../main')
  //   await Post.remove({})
  // })

  before(async () => {
    await require('../../../main')
    await User.remove({})
    await Post.remove({})
    newUser = await (new User(sampleUser)).save()
    newAdmin = await (new User(sampleAdmin)).save()
    samplePost1 = fakePost(newAdmin)
    samplePost2 = fakePost(newAdmin)
    samplePost3 = fakePost(newAdmin)
    samplePost4 = fakePost(newAdmin)
    samplePost5 = fakePost(newAdmin)
    newPost = fakePost(newAdmin)
    newPost1 = await (new Post(samplePost1)).save()
    newPost2 = await (new Post(samplePost2)).save()
    newPost3 = await (new Post(samplePost3)).save()
    newPost4 = await (new Post(samplePost4)).save()
    newPost5 = await (new Post(samplePost5)).save()
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
    it('GET / should be able to get a list of all the posts', async () => {
      await agent.get('/api/v1.0/posts')
        .then((res) => {
          expect(res).to.have.status(OK)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(5)
          expect(results[0]).to.have.property('title')
          expect(results[0]).to.have.property('description')
          expect(results[0]).to.have.property('content')
          expect(results[0]).to.have.property('author')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.have.property('updatedAt')
          expect(results[0]).to.have.property('openingDate')
          expect(results[0]).to.have.property('closingDate')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('POST / should not be able to create a post', async () => {
      await agent.post('/api/v1.0/posts')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newPost)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to get a post', async () => {
      await agent.get(`/api/v1.0/posts/${newPost1.id}`)
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')          
          expect(res.body).to.have.property('title')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('content')
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('openingDate')
          expect(res.body).to.have.property('closingDate')
        })
        .catch((err) => {
          
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('PUT /:id should not be able to modify a post', async () => {
      await agent.put(`/api/v1.0/posts/${newPost1.id}`)
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
    it('DELETE /:id should not be able to delete a post', async () => {
      await agent.delete(`/api/v1.0/posts/${newPost1.id}`)
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
    it('GET / should be able to get a list of all the posts', async () => {
      await agent.get('/api/v1.0/posts')
        .then((res) => {
          expect(res).to.have.status(OK)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(5)
          expect(results[0]).to.have.property('title')
          expect(results[0]).to.have.property('description')
          expect(results[0]).to.have.property('content')
          expect(results[0]).to.have.property('author')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.have.property('updatedAt')
          expect(results[0]).to.have.property('openingDate')
          expect(results[0]).to.have.property('closingDate')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('POST / should not be able to create a post', async () => {
      await agent.post('/api/v1.0/posts')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newPost)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
        })
        .catch((err) => {
          
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to get a post', async () => {
      await agent.get(`/api/v1.0/posts/${newPost1.id}`)
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('title')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('content')
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('openingDate')
          expect(res.body).to.have.property('closingDate')
        })
        .catch((err) => {
          
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('PUT /:id should not be able to modify a post', async () => {
      await agent.put(`/api/v1.0/posts/${newPost1.id}`)
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
    it('DELETE /:id should not be able to delete a post', async () => {
      await agent.delete(`/api/v1.0/posts/${newPost1.id}`)
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
    it('GET / should be able to get a list of all the posts', async () => {
      await agent.get('/api/v1.0/posts')
        .then((res) => {
          expect(res).to.have.status(OK)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(5)
          expect(results[0]).to.have.property('title')
          expect(results[0]).to.have.property('description')
          expect(results[0]).to.have.property('content')
          expect(results[0]).to.have.property('author')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.have.property('updatedAt')
          expect(results[0]).to.have.property('openingDate')
          expect(results[0]).to.have.property('closingDate')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          
          // expect(err).to.have.status(FORBIDDEN)
          throw err
        })
    })
    it('POST / should be able to create a post', async () => {
      await agent.post('/api/v1.0/posts')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newPost)
        .then((res) => {
          expect(res).to.have.status(CREATED)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('title')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('content')
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('openingDate')
          expect(res.body).to.have.property('closingDate')
        })
        .catch((err) => {          
          throw err
        })
    })
    it('GET /:id should be able to get a post', async () => {
      await agent.get(`/api/v1.0/posts/${newPost1.id}`)
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('title')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('content')
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('openingDate')
          expect(res.body).to.have.property('closingDate')
        })
        .catch((err) => {

          throw err
        })
    })
    it('PUT /:id should not be able to modify a post', async () => {
      let newTitle = 'This is quite an updated title'
      await agent.put(`/api/v1.0/posts/${newPost1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({title: newTitle})
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('title')
          expect(res.body.title).to.be.equal(newTitle)
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('content')
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('openingDate')
          expect(res.body).to.have.property('closingDate')
        })
        .catch((err) => {
          throw err
        })
    })
    it('DELETE /:id should not be able to delete a post', async () => {
      await agent.delete(`/api/v1.0/posts/${newPost1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.be.equal(newPost1.id)
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
