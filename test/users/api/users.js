const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
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
let csrfToken = null
let newAdmin = null
let agent = null
describe('/api/v1.0/users', () => {
  before(async () => {
    await require('../../../main')
    await User.remove({})
    newUser1 = await (new User(sampleUser1)).save()
    newAdmin = await (new User(sampleAdmin)).save()
  })

  describe('As Anonymous', () => {
    it('GET / should not be able to access the list of all users', async () => {
      await chai.request('http://localhost:3000')
        .get('/api/v1.0/users')
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
      await chai.request('http://localhost:3000')
        .post('/api/v1.0/users')
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
    it('GET /:id should be able to get an user without private data a user', async () => {
      await chai.request('http://localhost:3000')
        .get(`/api/v1.0/users/${newUser1.id}`)
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
      await chai.request('http://localhost:3000')
        .put(`/api/v1.0/users/${newUser1.id}`)
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
      await chai.request('http://localhost:3000')
        .delete(`/api/v1.0/users/${newUser1.id}`)
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
    it('should log in', async () => {
      await agent.post('/auth/signin')
        .set('X-CSRF-TOKEN', csrfToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: newUser1.email })
        .then((res) => {
          // console.log(res.body)
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
          // console.log(res.body)
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
    it('GET / should not be able to access the list of all users', async () => {
      await agent.get('/api/v1.0/users')
        .query({ limit: 10, page: 1 })
        .then((res) => {
          /* eslint-disable no-unused-expressions */
          // console.log(res.body)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(2)
          expect(results[0]).to.have.property('username')
          expect(results[0]).to.have.property('name')
          expect(results[0]).to.have.property('bio')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.not.have.property('email')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          throw err
        })
    })
    // it('POST / should not be able to create a user', async () => {
    //   await chai.request('http://localhost:3000')
    //     .post('/api/v1.0/users')
    //     .then((res) => {
    //       /* eslint-disable no-unused-expressions */
    //       expect(res).to.be.null
    //       throw res
    //     })
    //     .catch((err) => {
    //       // Should get a FORBIDDEN
    //       expect(err).to.have.status(FORBIDDEN)
    //     })
    // })
    it('GET /:id should be able to get an user with private data a user', async () => {
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

    // it('PUT /:id should not be able to modify a user', async () => {
    //   await chai.request('http://localhost:3000')
    //     .put(`/api/v1.0/users/${newUser1.id}`)
    //     .send(Object.assign(sampleUser1, { name: 'Updated Name' }))
    //     .then((res) => {
    //       /* eslint-disable no-unused-expressions */
    //       expect(res).to.be.null
    //       throw res
    //     })
    //     .catch((err) => {
    //       // Should get a FORBIDDEN
    //       expect(err).to.have.status(FORBIDDEN)
    //     })
    // })

    // it('DELETE /:id should not be able to delete a user', async () => {
    //   await chai.request('http://localhost:3000')
    //     .delete(`/api/v1.0/users/${newUser1.id}`)
    //     .then((res) => {
    //       /* eslint-disable no-unused-expressions */
    //       expect(res).to.be.null
    //       throw res
    //     })
    //     .catch((err) => {
    //       // Should get a FORBIDDEN
    //       expect(err).to.have.status(FORBIDDEN)
    //     })
    // })
    // after(async () => {
    //   // Close agent
    //   agent.close()
    // })
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
