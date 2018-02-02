const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')

const Setting = require('../../../cms/models/setting')
const setting = require('../../../cms/db-api/setting')

const sampleSetting = { settingName: 'SETTINGNAME' }

describe('db-api.settings', () => {
  describe('#create', () => {
    it('should create a setting', () => {
      // require module with rewire to override its internal Settings reference
      const setting = rewire('../../../cms/db-api/settings')

      // replace Setting constructor for a spy
      const SettingMock = sinon.spy()

      // add a save method that only returns the data
      SettingMock.prototype.save = () => { return Promise.resolve(sampleSetting) }

      // create a spy for the save method
      const save = sinon.spy(SettingMock.prototype, 'save')

      // override Setting inside `cms/db-api/settings`
      setting.__set__('Setting', SettingMock)

      // call create method
      return setting.create(sampleSetting)
        .then((result) => {
          sinon.assert.calledWithNew(SettingMock)
          sinon.assert.calledWith(SettingMock, sampleSetting)
          sinon.assert.calledOnce(save)
          expect(result).to.equal(sampleSetting)
        })
    })
  })

  describe('#get', () => {
    it('should get a setting', () => {
      const SettingMock = sinon.mock(Setting)

      SettingMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(sampleSetting)

      return setting.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          SettingMock.verify()
          SettingMock.restore()
          expect(result).to.equal(sampleSetting)
        })
    })
  })

  // describe('#list', () => {
  //   it('should list all settings', () => {
  //     const SettingMock = sinon.mock(Setting)

  //     SettingMock
  //       .expects('paginate').withArgs({}, { limit: 10, page: 1 })
  //       .resolves(sampleSetting)

  //     return setting.list({ limit: 10, page: 1 })
  //       .then((result) => {
  //         SettingMock.verify()
  //         SettingMock.restore()
  //         expect(result).to.equal(sampleSetting)
  //       })
  //   })
  // })

  describe('#update', () => {
    it('should update a setting', () => {
      const SettingMock = sinon.mock(Setting)
      const save = sinon.spy(() => sampleSetting)

      SettingMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return setting.update({ id: '5a5e29d948a9cc2fbeed02fa', setting: {} })
        .then((result) => {
          SettingMock.verify()
          SettingMock.restore()
          sinon.assert.calledOnce(save)
          expect(result).to.equal(sampleSetting)
        })
    })
  })

  describe('#remove', () => {
    it('should remove a setting', () => {
      const SettingMock = sinon.mock(Setting)
      const remove = sinon.spy()

      SettingMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ remove })

      return setting.remove('5a5e29d948a9cc2fbeed02fa')
        .then(() => {
          SettingMock.verify()
          SettingMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })
})
