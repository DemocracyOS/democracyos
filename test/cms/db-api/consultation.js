const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const Consultation = require('cms/models/consultation')
const consultation = require('cms/db-api/consultation')
const sampleConsultation = {
  title: 'TITLE',
  content: 'CONTENT',
  reactionId: 'REACTION ID',
  author: 'AUTHOR',
  openingDate: Date.now(),
  closingDate: Date.now(),
  tags: ['tags']
}

describe('UNIT: Consultation', function () {
  it('should create a new consultation', function () {
    // require module with rewire to override its internal Consultation reference
    const consultation = rewire('cms/db-api/consultation')

    // replace User constructor for a spy
    const ConsultationMock = sinon.spy()

    // add a save method that only returns the data
    ConsultationMock.prototype.save = function () { return Promise.resolve(sampleConsultation) }

    // create a spy for the save method
    const save = sinon.spy(ConsultationMock.prototype, 'save')

    // override User inside `user/db-api/user`
    consultation.__set__('Consultation', ConsultationMock)

    // call create method
    return consultation.create(sampleConsultation)
      .then((result) => {
        sinon.assert.calledWith(ConsultationMock, sampleConsultation)
        sinon.assert.calledOnce(save)
        assert.equal(result, sampleConsultation)
      })
  })

  it('should get a consultation from a given id', function () {
    const ConsultationMock = sinon.mock(Consultation)

    ConsultationMock
      .expects('find').withArgs({ _id: 'ID' })
      .chain('exec')
      .resolves(sampleConsultation)

    return consultation.get('ID')
      .then((result) => {
        ConsultationMock.verify()
        ConsultationMock.restore()
        assert.equal(result, sampleConsultation)
      })
  })

  it('should list all consultations already saved', function () {
    const ConsultationMock = sinon.mock(Consultation)

    ConsultationMock
      .expects('paginate').withArgs({}, { limit: 10, page: 1 })
      .resolves(sampleConsultation)

    return consultation.list({ limit: 10, page: 1 })
      .then((result) => {
        ConsultationMock.verify()
        ConsultationMock.restore()
        assert.equal(result, sampleConsultation)
      })
  })

  it('should update a consultation', function () {
    const ConsultationMock = sinon.mock(Consultation)
    const save = sinon.spy(() => sampleConsultation)

    ConsultationMock
      .expects('find').withArgs({ _id: 'ID' })
      .chain('exec')
      .resolves({ save })

    return consultation.update({ id: 'ID', title: {} })
      .then((result) => {
        ConsultationMock.verify()
        ConsultationMock.restore()
        sinon.assert.calledOnce(save)
        assert.equal(result, sampleConsultation)
      })
  })

  it('should remove a consultation', function () {
    const ConsultationMock = sinon.mock(Consultation)
    const remove = sinon.spy()

    ConsultationMock
      .expects('find').withArgs({ _id: 'ID' })
      .chain('exec')
      .resolves({ remove })

    return consultation.remove('ID')
      .then(() => {
        ConsultationMock.verify()
        ConsultationMock.restore()
        sinon.assert.calledOnce(remove)
      })
  })
})
