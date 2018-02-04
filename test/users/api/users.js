const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const User = require('../../../users/models/user')

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/users', () => {
  before(async () => {
    await require('../../../main')
  })

  beforeEach(async () => {
    await User.remove({})
  })

  const sampleUser = {
    username: 'test',
    name: 'Test T. Test',
    bio: 'test bio',
    email: 'test@te.st'
  }

  describe('#post', () => {
    it('should create a user', async () => {
      const res = await chai.request('http://localhost:3000')
        .post('/api/v1.0/users')
        .send(sampleUser)

      expect(res).to.have.status(CREATED)
    })
  })

  describe('#list', () => {
    it('should list all users', async () => {
      const res = await chai.request('http://localhost:3000')
        .get('/api/v1.0/users')
        .query({ limit: 10, page: 1 })

      expect(res).to.have.status(OK)

      const { results, pagination } = res.body

      expect(results).to.be.a('array')
      expect(results.length).to.be.eql(0)
      expect(pagination).to.have.property('count')
      expect(pagination).to.have.property('page')
      expect(pagination).to.have.property('limit')
    })
  })

  describe('#get', () => {
    it('should get a user by id', async () => {
      let newUser = await (new User(sampleUser)).save()
      const res = await chai.request('http://localhost:3000')
        .get(`/api/v1.0/users/${newUser.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('username')
      expect(res.body).to.have.property('name')
      expect(res.body).to.have.property('bio')
      expect(res.body).to.have.property('email')
    })
  })

  describe('#put', () => {
    it('should update a user', async () => {
      let newUser = await (new User(sampleUser)).save()
      const res = await chai.request('http://localhost:3000')
        .put(`/api/v1.0/users/${newUser.id}`)
        .send(Object.assign(sampleUser, { name: 'Updated Name' }))

      expect(res).to.have.status(NO_CONTENT)
    })
  })

  describe('#delete', () => {
    it('should remove a user', async () => {
      let newUser = await (new User(sampleUser)).save()
      const res = await chai.request('http://localhost:3000')
        .delete(`/api/v1.0/users/${newUser.id}`)

      expect(res).to.have.status(NO_CONTENT)
    })
  })
})
