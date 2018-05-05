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

let newUser1 = null
describe('/api/v1.0/users', () => {
  before(async () => {
    await require('../../../main')
    await User.remove({})
  })

  beforeEach(async () => {
  })

  describe('As Anonymous', () => {
    before(async () => {
      newUser1 = await (new User(sampleUser1)).save()
    })
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
})
