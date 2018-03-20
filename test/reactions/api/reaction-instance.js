const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionInstance = require('../../../reactions/models/reaction-instance')
const ReactionRule = require('../../../reactions/models/reaction-rule')
const sampleReactionRule = new ReactionRule({
  method: 'LIKE',
  startingDate: new Date('2017-12-20 00:00:00'),
  closingDate: new Date('2018-02-20 00:00:00')
})
const sampleReactionInstance = {
  reactionId: sampleReactionRule._id,
  resourceType: 'Article',
  resourceId: '000001',
  results: []
}

const anotherReactionRule = new ReactionRule({
  method: 'LIKE',
  startingDate: new Date('2017-12-24 00:00:00'),
  closingDate: new Date('2018-02-25 00:00:00')
})
const anotherReactionInstance = {
  reactionId: anotherReactionRule._id,
  resourceType: 'Video',
  resourceId: '000002',
  results: []
}

const otherReactionRule = new ReactionRule({
  method: 'LIKE',
  startingDate: new Date('2017-12-23 00:00:00'),
  closingDate: new Date('2018-02-28 00:00:00')
})
const otherReactionInstance = {
  reactionId: otherReactionRule._id,
  resourceType: 'Post',
  resourceId: '000003',
  results: []
}

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/reaction-instance', () => {
  before(async () => {
    await require('../../../main')
  })

  beforeEach(async () => {
    await ReactionInstance.remove({})
  })

  describe('#post', () => {
    it('should create a reaction instance', async () => {
      const res = await chai.request('http://localhost:3000')
        .post('/api/v1.0/reaction-instance')
        .send(sampleReactionInstance)

      expect(res).to.have.status(CREATED)
    })
  })

  describe('#list', () => {
    it('should list all reaction instances', async () => {
      await (new ReactionInstance(sampleReactionInstance)).save()
      await (new ReactionInstance(anotherReactionInstance)).save()
      await (new ReactionInstance(otherReactionInstance)).save()

      const res = await chai.request('http://localhost:3000')
        .get('/api/v1.0/reaction-instance')
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
    it('should get a reaction instance by id', async () => {
      let newReactionInstance = await (new ReactionInstance(sampleReactionInstance)).save()
      const res = await chai.request('http://localhost:3000')
        .get(`/api/v1.0/reaction-instance/${newReactionInstance.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      // Check if the response contains all the properties of the object
      let properties = Object.keys(sampleReactionInstance)
      properties.map((prop) => expect(res.body).to.have.property(prop))
    })
  })

  describe('#put', () => {
    it('should update a reaction instance', async () => {
      let newReactionInstance = await (new ReactionInstance(sampleReactionInstance)).save()
      const res = await chai.request('http://localhost:3000')
        .put(`/api/v1.0/reaction-instance/${newReactionInstance.id}`)
        .send(Object.assign(sampleReactionInstance, { resourceId: 12345 }))

      expect(res).to.have.status(OK)
    })
  })

  describe('#delete', () => {
    it('should remove a reaction instance', async () => {
      let newReactionInstance = await (new ReactionInstance(sampleReactionInstance)).save()
      const res = await chai.request('http://localhost:3000')
        .delete(`/api/v1.0/reaction-instance/${newReactionInstance.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('id')
    })
  })
})
