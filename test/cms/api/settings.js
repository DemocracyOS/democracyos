const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const app = require('../../../main')
const Setting = require('../../../cms/models/setting')

require('../../../main/mongoose')

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/settings', () => {
  beforeEach(async () => {
    await Setting.remove({})
  })

  const sampleSetting = {
    settingName: 'test',
    logo: 'test',
    permissions: 'test',
    theme: 'test'
  }

  describe('#post', () => {
    it('should create a setting', async () => {
      const res = await chai.request(app)
        .post('/api/v1.0/settings')
        .send(sampleSetting)

      expect(res).to.have.status(CREATED)
    })
  })

  describe('#list', () => {
    it('should list all settings', async () => {
      const res = await chai.request(app)
        .get('/api/v1.0/settings')
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
    it('should get a setting by id', async () => {
      let newSetting = await (new Setting(sampleSetting)).save()
      const res = await chai.request(app)
        .get(`/api/v1.0/settings/${newSetting.id}`)

      expect(res).to.have.status(OK)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('settingName')
      expect(res.body).to.have.property('logo')
      expect(res.body).to.have.property('permissions')
      expect(res.body).to.have.property('theme')

    })
  })

  describe('#put', () => {
    it('should update a setting', async () => {
      let newSetting = await (new Setting(sampleSetting)).save()
      const res = await chai.request(app)
        .put(`/api/v1.0/settings/${newSetting.id}`)
        .send(Object.assign(sampleSetting, { settingName: 'Updated Name' }))

      expect(res).to.have.status(NO_CONTENT)
    })
  })

  describe('#delete', () => {
    it('should remove a setting', async () => {
      let newSetting = await (new Setting(sampleSetting)).save()
      const res = await chai.request(app)
        .delete(`/api/v1.0/settings/${newSetting.id}`)

      expect(res).to.have.status(NO_CONTENT)
    })
  })
})
