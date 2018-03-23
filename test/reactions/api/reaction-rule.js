const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionRule = require('../../../reactions/models/reaction-rule')

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/reaction-rule', () => {
  before(async () => {
    await require('../../../main')
  })

  beforeEach(async () => {
    await ReactionRule.remove({})
  })

  const sampleReactionRule = {
    name: 'MyReactionConfig',
    method: 'LIKE',
    startingDate: new Date('2017-12-20 00:00:00'),
    closingDate: new Date('2018-04-20 18:00:00'),
    limit: 5,
    options: {
      commentsAvailable: true
    }
  }
  const anotherReactionRule = {
    name: 'MyReactionRule',
    method: 'LIKE',
    startingDate: new Date('2017-12-21 00:00:00'),
    closingDate: new Date('2018-04-21 18:00:00'),
    limit: 8,
    options: {
      commentsAvailable: true
    }
  }
  const otherReactionRule = {
    name: 'TotallyDifferentName',
    method: 'LIKE',
    startingDate: new Date('2017-12-22 00:00:00'),
    closingDate: new Date('2018-04-22 18:00:00'),
    limit: 20,
    options: {
      commentsAvailable: true
    }
  }

  describe('#post', () => {
    it('should create a reaction rule', async () => {
      const res = await chai.request('http://localhost:3000')
        .post('/api/v1.0/reaction-rule')
        .send(sampleReactionRule)

      expect(res).to.have.status(CREATED)
    })
  })

  describe('#list', () => {
    it('should list all reaction rule', async () => {
      await (new ReactionRule(sampleReactionRule)).save()
      await (new ReactionRule(anotherReactionRule)).save()
      await (new ReactionRule(otherReactionRule)).save()

      const res = await chai.request('http://localhost:3000')
        .get('/api/v1.0/reaction-rule')
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
    it('should get a reaction rule by id', async () => {
      let newReactionRule = await (new ReactionRule(sampleReactionRule)).save()
      const res = await chai.request('http://localhost:3000')
        .get(`/api/v1.0/reaction-rule/${newReactionRule.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      // Check if the response contains all the properties of the object
      let properties = Object.keys(sampleReactionRule)
      properties.map((prop) => expect(res.body).to.have.property(prop))
    })
  })

  describe('#listByName', () => {
    it('should list all reaction rule that matches a given string', async () => {
      await (new ReactionRule(sampleReactionRule)).save()
      await (new ReactionRule(anotherReactionRule)).save()
      await (new ReactionRule(otherReactionRule)).save()
      const res = await chai.request('http://localhost:3000')
        .get('/api/v1.0/reaction-rule')
        .query({ filter: '{ "name": "total" }', limit: 10, page: 1 })

      expect(res).to.have.status(OK)

      const { results, pagination } = res.body

      expect(results).to.be.a('array')
      expect(results.length).to.be.eql(1)
      expect(pagination).to.have.property('count')
      expect(pagination).to.have.property('page')
      expect(pagination).to.have.property('limit')
    })
  })

  describe('#put', () => {
    it('should update a reaction rule', async () => {
      let newReactionRule = await (new ReactionRule(sampleReactionRule)).save()
      const res = await chai.request('http://localhost:3000')
        .put(`/api/v1.0/reaction-rule/${newReactionRule.id}`)
        .send(Object.assign(sampleReactionRule, { name: 'UpdatedName' }))

      expect(res).to.have.status(OK)
    })
  })

  describe('#delete', () => {
    it('should remove a reaction rule', async () => {
      let newReactionRule = await (new ReactionRule(sampleReactionRule)).save()
      const res = await chai.request('http://localhost:3000')
        .delete(`/api/v1.0/reaction-rule/${newReactionRule.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('id')
    })
  })
})
