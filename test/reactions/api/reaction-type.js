const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const app = require('../../../main')
const ReactionType = require('../../../reactions/models/reaction-type')

require('../../../main/mongoose')

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/reaction-type', () => {
  beforeEach(async () => {
    await ReactionType.remove({})
  })

  const sampleReactionType = {
    name: 'MyReactionConfig',
    method: 'LIKE',
    startingDate: new Date('2017-12-20 00:00:00'),
    closingDate: new Date('2018-04-20 18:00:00'),
    limit: 5
  }
  const anotherReactionType = {
    name: 'MyReactionType',
    method: 'LIKE',
    startingDate: new Date('2017-12-21 00:00:00'),
    closingDate: new Date('2018-04-21 18:00:00'),
    limit: 8
  }
  const otherReactionType = {
    name: 'TotallyDifferentName',
    method: 'LIKE',
    startingDate: new Date('2017-12-22 00:00:00'),
    closingDate: new Date('2018-04-22 18:00:00'),
    limit: 20
  }

  describe('#post', () => {
    it('should create a reaction type', async () => {
      const res = await chai.request(app)
        .post('/api/v1.0/reaction-type')
        .send(sampleReactionType)

      expect(res).to.have.status(CREATED)
    })
  })

  describe('#list', () => {
    it('should list all reaction type', async () => {
      await (new ReactionType(sampleReactionType)).save()
      await (new ReactionType(anotherReactionType)).save()
      await (new ReactionType(otherReactionType)).save()

      const res = await chai.request(app)
        .get('/api/v1.0/reaction-type')
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
    it('should get a reaction type by id', async () => {
      let newReactionType = await (new ReactionType(sampleReactionType)).save()
      const res = await chai.request(app)
        .get(`/api/v1.0/reaction-type/${newReactionType.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      // Check if the response contains all the properties of the object
      let properties = Object.keys(sampleReactionType)
      properties.map((prop) => expect(res.body).to.have.property(prop))
    })
  })


  describe('#listByName', () => {
    it('should list all reaction type that matches a given string', async () => {
      let firstReactionType = await (new ReactionType(sampleReactionType)).save()
      let secondReactionType = await (new ReactionType(anotherReactionType)).save()
      let thirdReactionType = await (new ReactionType(otherReactionType)).save()
      const res = await chai.request(app)
        .get('/api/v1.0/reaction-type')
        .query({ name: 'total', limit: 10, page: 1 })

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
    it('should update a reaction type', async () => {
      let newReactionType = await (new ReactionType(sampleReactionType)).save()
      const res = await chai.request(app)
        .put(`/api/v1.0/reaction-type/${newReactionType.id}`)
        .send(Object.assign(sampleReactionType, { name: 'UpdatedName' }))

      expect(res).to.have.status(NO_CONTENT)
    })
  })

  describe('#delete', () => {
    it('should remove a reaction type', async () => {
      let newReactionType = await (new ReactionType(sampleReactionType)).save()
      const res = await chai.request(app)
        .delete(`/api/v1.0/reaction-type/${newReactionType.id}`)

      expect(res).to.have.status(NO_CONTENT)
    })
  })
})
