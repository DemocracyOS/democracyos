const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  NO_CONTENT
} = require('http-status')
const User = require('../../../users/models/user')
const { fakeUser } = require('../utils')

const expect = chai.expect
chai.use(chaiHttp)

const sampleUser1 = fakeUser('user')
const sampleUser2 = fakeUser('user')
const sampleUser3 = fakeUser('user')
const sampleAdmin = fakeUser('admin')

// Util global variables
let newUser1 = null
let newUser2 = null
let csrfToken = null
let newAdmin = null
let agent = null
describe('/api/v1.0/users', () => {
  before(async () => {
    await require('../../../main')
    await User.remove({})
    newUser1 = await (new User(sampleUser1)).save()
    newUser2 = await (new User(sampleUser2)).save()
    newAdmin = await (new User(sampleAdmin)).save()
  })

  describe('As Anonymous', () => {
    before(async () => {
      // Log In as aser
      agent = await chai.request.agent('http://localhost:3000')
    })
    it('should get csrfToken', async () => {
      await agent.get('/auth/csrf')
        .then((res) => {
          // console.log(res.body)
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('csrfToken')
          csrfToken = res.body.csrfToken
        })
        .catch((err) => {
          throw err
        })
    })
    it('GET / should not be able to access the list of all users', async () => {
      await agent.get('/api/v1.0/users')
        .query({ limit: 10, page: 1 })
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('POST / should not be able to create a user', async () => {
      await agent.post('/api/v1.0/users')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          // No one should be able to make a post
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to get an user without private data a user', async () => {
      await agent.get(`/api/v1.0/users/${newUser1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.not.have.property('email')
          expect(res.body).to.not.have.property('firstLogin')
          expect(res.body).to.not.have.property('updatedAt')
          expect(res.body).to.not.have.property('role')
          expect(res.body).to.not.have.property('updatedAt')
        })
        .catch((err) => {
          // Should get an Error!
          console.error(err)
          throw err
        })
    })

    it('PUT /:id should not be able to modify a user', async () => {
      await agent.put(`/api/v1.0/users/${newUser1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(Object.assign(sampleUser1, { name: 'Updated Name' }))
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })

    it('DELETE /:id should not be able to delete a user', async () => {
      await agent.delete(`/api/v1.0/users/${newUser1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
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
        .send({ email: newUser1.email })
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
    it('GET / should be able to access the list of all users BUT without email info', async () => {
      await agent.get('/api/v1.0/users')
        .query({ limit: 10, page: 1 })
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.equal(3)
          expect(results[0]).to.have.property('username')
          expect(results[0]).to.have.property('name')
          expect(results[0]).to.have.property('bio')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.not.have.property('email')
          expect(results[0]).to.not.have.property('firstLogin')
          expect(results[0]).to.not.have.property('emailToken')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          throw err
        })
    })

    it('POST / should not be able to create a user', async () => {
      await agent.post('/api/v1.0/users')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to get its data with its private data', async () => {
      await agent.get(`/api/v1.0/users/${newUser1.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('email')
          expect(res.body).to.not.have.property('firstLogin')
          expect(res.body).to.not.have.property('emailToken')
          expect(res.body).to.not.have.property('updatedAt')
          expect(res.body).to.not.have.property('role')
        })
        .catch((err) => {
          throw err
        })
    })

    it('GET /:id should be able to get others data but not its private data', async () => {
      await agent.get(`/api/v1.0/users/${newAdmin.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.not.have.property('email')
          expect(res.body).to.not.have.property('firstLogin')
          expect(res.body).to.not.have.property('emailToken')
          expect(res.body).to.not.have.property('updatedAt')
          expect(res.body).to.not.have.property('role')
        })
        .catch((err) => {
          throw err
        })
    })

    it('PUT /:id should be able to modify its user data', async () => {
      let newName = 'Updated Name'
      await agent.put(`/api/v1.0/users/${newUser1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ name: newName })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body.name).to.be.equal(newName)
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('email')
          expect(res.body).to.not.have.property('firstLogin')
          expect(res.body).to.not.have.property('emailToken')
          expect(res.body).to.not.have.property('updatedAt')
          expect(res.body).to.not.have.property('role')
        })
        .catch((err) => {
          throw err
        })
    })

    it('PUT /:id should not be able to modify others user data', async () => {
      await agent.put(`/api/v1.0/users/${newAdmin.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })

    it('DELETE /:id should not be able to self-delete', async () => {
      await agent.delete(`/api/v1.0/users/${newUser1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })

    it('DELETE /:id should not be able to delete another user', async () => {
      await agent.delete(`/api/v1.0/users/${newAdmin.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
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
    it('GET / should be able to access the list of all users', async () => {
      await agent.get('/api/v1.0/users')
        .query({ limit: 10, page: 1 })
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(3)
          expect(results[0]).to.have.property('username')
          expect(results[0]).to.have.property('name')
          expect(results[0]).to.have.property('bio')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.have.property('email')
          expect(results[0]).to.have.property('firstLogin')
          expect(results[0]).to.have.property('emailToken')
          expect(results[0]).to.have.property('updatedAt')
          expect(results[0]).to.have.property('role')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          throw err
        })
    })

    it('POST / should not be able to create a user', async () => {
      await agent.post('/api/v1.0/users')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.be.null
          throw res
        })
        .catch((err) => {
          // Should get a FORBIDDEN
          expect(err).to.have.status(FORBIDDEN)
        })
    })
    it('GET /:id should be able to get its data with its private data + admin data', async () => {
      await agent.get(`/api/v1.0/users/${newAdmin.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('email')
          expect(res.body).to.have.property('firstLogin')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('role')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })

    it('GET /:id should be able to get others data + its private data (admin purposes)', async () => {
      await agent.get(`/api/v1.0/users/${newUser1.id}`)
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('email')
          expect(res.body).to.have.property('firstLogin')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('role')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })

    it('PUT /:id should be able to modify its user data', async () => {
      let newName = 'Updated Admin'
      await agent.put(`/api/v1.0/users/${newAdmin.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ name: newName })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body.name).to.be.equal(newName)
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('email')
          expect(res.body).to.have.property('firstLogin')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('role')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })

    it('PUT /:id should be able to modify others user data', async () => {
      let newName = 'fixedUsername_byAdmin'      
      await agent.put(`/api/v1.0/users/${newUser1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ username: newName })
        .then((res) => {
          expect(res).to.have.status(OK)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('name')
          expect(res.body.username).to.be.equal(newName)
          expect(res.body).to.have.property('bio')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('email')
          expect(res.body).to.have.property('firstLogin')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('role')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })

    it('DELETE /:id should be able to delete another user', async () => {
      await agent.delete(`/api/v1.0/users/${newUser1.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.be.equal(newUser1.id)
        })
        .catch((err) => {
          throw err
        })
    })

    it('DELETE /:id should be able to self-delete (DANGER)', async () => {
      await agent.delete(`/api/v1.0/users/${newAdmin.id}`)
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(OK)
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.be.equal(newAdmin.id)
        })
        .catch((err) => {
          throw err
        })
    })

  })

  // describe('#post', () => {
  //   it('should create a user', async () => {
  //     const res = await chai.request('http://localhost:3000')
  //       .post('/api/v1.0/users')
  //       .send(sampleUser)

  //     expect(res).to.have.status(CREATED)
  //   })
  // })

  // describe('#list', () => {
  //   it('should list all users', async () => {
  //     const res = await chai.request('http://localhost:3000')
  //       .get('/api/v1.0/users')
  //       .query({ limit: 10, page: 1 })

  //     expect(res).to.have.status(OK)

  //     const { results, pagination } = res.body

  //     expect(results).to.be.a('array')
  //     expect(results.length).to.be.eql(0)
  //     expect(pagination).to.have.property('count')
  //     expect(pagination).to.have.property('page')
  //     expect(pagination).to.have.property('limit')
  //   })
  // })

  // describe('#get', () => {
  //   it('should get a user by id', async () => {
  //     let newUser = await (new User(sampleUser)).save()
  //     const res = await chai.request('http://localhost:3000')
  //       .get(`/api/v1.0/users/${newUser.id}`)

  //     expect(res).to.have.status(OK)
  //     expect(res.body).to.be.a('object')
  //     expect(res.body).to.have.property('username')
  //     expect(res.body).to.have.property('name')
  //     expect(res.body).to.have.property('bio')
  //     expect(res.body).to.have.property('email')
  //     expect(res.body).to.have.property('firstLogin')
  //   })
  // })

  // describe('#put', () => {
  //   it('should update a user', async () => {
  //     let newUser = await (new User(sampleUser)).save()
  //     const res = await chai.request('http://localhost:3000')
  //       .put(`/api/v1.0/users/${newUser.id}`)
  //       .send(Object.assign(sampleUser, { name: 'Updated Name' }))

  //     expect(res).to.have.status(OK)
  //   })
  // })

  // describe('#delete', () => {
  //   it('should remove a user', async () => {
  //     let newUser = await (new User(sampleUser)).save()
  //     const res = await chai.request('http://localhost:3000')
  //       .delete(`/api/v1.0/users/${newUser.id}`)

  //     expect(res).to.have.status(OK)
  //     expect(res.body).to.be.a('object')
  //     expect(res.body).to.have.property('id')
  //   })
  // })
})
