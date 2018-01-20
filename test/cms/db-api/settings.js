const { Types: { ObjectId } } = require('mongoose')
const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const Settings = require('../../../cms/models/setting')
const settings = require('../../../cms/db-api/settings')
const sampleSettings = { settingsname: 'COMMUNITYNAME' }

describe('db-api.settings', function () {
  describe('#create', () => {
    it('should create a settings', function () {
      // require module with rewire to override its internal Settings reference
      const settings = rewire('../../../cms/db-api/settings')

      // replace Settings constructor for a spy
      const SettingsMock = sinon.spy()

      // add a save method that only returns the data
      SettingsMock.prototype.save = function () { return Promise.resolve(sampleSettings) }

      // create a spy for the save method
      const save = sinon.spy(SettingsMock.prototype, 'save')

      // override Settings inside `settings/db-api/settings`
      settings.__set__('Settings', SettingsMock)

      // call create method
      return settings.create(sampleSettings)
        .then((result) => {
          sinon.assert.calledWith(SettingsMock, sampleSettings)
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleSettings)
        })
    })
  })

  describe('#get', () => {
    it('should get a settings', function () {
      const SettingsMock = sinon.mock(Settings)

      SettingsMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(sampleSettings)

      return settings.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          SettingsMock.verify()
          SettingsMock.restore()
          assert.equal(result, sampleSettings)
        })
    })
  })

  describe('#update', () => {
    it('should update a settings', function () {
      const SettingsMock = sinon.mock(Settings)
      const save = sinon.spy(() => sampleSettings)

      SettingsMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return settings.update({ id: '5a5e29d948a9cc2fbeed02fa', settings: {} })
        .then((result) => {
          SettingsMock.verify()
          SettingsMock.restore()
          sinon.assert.calledOnce(save)
          assert.equal(result, sampleSettings)
        })
    })
  })

  describe('#remove', () => {
    it('should remove a settings', function () {
      const SettingsMock = sinon.mock(Settings)
      const remove = sinon.spy()

      SettingsMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ remove })

      return settings.remove('5a5e29d948a9cc2fbeed02fa')
        .then(() => {
          SettingsMock.verify()
          SettingsMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })
})
