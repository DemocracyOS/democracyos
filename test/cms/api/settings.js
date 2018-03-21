const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  BAD_REQUEST
} = require('http-status')
const Setting = require('../../../cms/models/setting')

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/settings', () => {
  before(async () => {
    await require('../../../main')
  })

  beforeEach(async () => {
    await Setting.remove({})
  })

  const sampleSetting = {
    communityName: 'test',
    mainColor: 'test'
  }

  describe('#post', () => {
    it('should create a setting', async () => {
      const res = await chai.request('http://localhost:3000')
        .post('/api/v1.0/settings')
        .send(sampleSetting)

      expect(res).to.have.status(CREATED)
    })
  })

  describe('#post /error/400', () => {
    it('should return an error if a setting is already created', async () => {
      let newSetting = await(new Setting(sampleSetting)).save()
      try {
        const res = await chai.request('http://localhost:3000')
          .post('/api/v1.0/settings')
          .send(sampleSetting)
        expect.fail(null, null, 'Should not succeed.')
      } catch (err) {
        expect(err).to.have.status(BAD_REQUEST)
        expect(err).to.have.property('message')
        expect(err.message).to.be.eql('Bad Request')
      }
    })
  })

  describe('#list', () => {
    it('should list all settings', async () => {
      let newSetting = await (new Setting(sampleSetting)).save()
      const res = await chai.request('http://localhost:3000')
        .get('/api/v1.0/settings')

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('communityName')
      expect(res.body).to.have.property('mainColor')
    })
  })

  describe('#get', () => {
    it('should get a setting by id', async () => {
      let newSetting = await (new Setting(sampleSetting)).save()
      const res = await chai.request('http://localhost:3000')
        .get(`/api/v1.0/settings/${newSetting.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('communityName')
      expect(res.body).to.have.property('mainColor')
    })
  })

  describe('#put', () => {
    it('should update a setting', async () => {
      let newSetting = await (new Setting(sampleSetting)).save()
      const res = await chai.request('http://localhost:3000')
        .put(`/api/v1.0/settings/${newSetting.id}`)
        .send(Object.assign(sampleSetting, { communityName: 'Updated Name' }))

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('communityName')
      expect(res.body).to.have.property('mainColor')
    })
  })

  describe('#delete', () => {
    it('should remove a setting', async () => {
      let newSetting = await (new Setting(sampleSetting)).save()
      const res = await chai.request('http://localhost:3000')
        .delete(`/api/v1.0/settings/${newSetting.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('id')
    })
  })
})
