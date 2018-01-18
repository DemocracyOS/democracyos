const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const Community = require('cms/models/community')
const community = require('cms/db-api/community')
const sampleCommunity = { communityname: 'COMMUNITYNAME' }

describe('UNIT: Communities', function () {
  it('should create a community', function () {
    // require module with rewire to override its internal Community reference
    const community = rewire('cms/db-api/community')

    // replace Community constructor for a spy
    const CommunityMock = sinon.spy()

    // add a save method that only returns the data
    CommunityMock.prototype.save = function () { return Promise.resolve(sampleCommunity) }

    // create a spy for the save method
    const save = sinon.spy(CommunityMock.prototype, 'save')

    // override Community inside `community/db-api/community`
    community.__set__('Community', CommunityMock)

    // call create method
    return community.create(sampleCommunity)
      .then((result) => {
        sinon.assert.calledWith(CommunityMock, sampleCommunity)
        sinon.assert.calledOnce(save)
        assert.equal(result, sampleCommunity)
      })
  })

  it('should get a community', function () {
    const CommunityMock = sinon.mock(Community)

    CommunityMock
      .expects('find').withArgs({ _id: 'ID' })
      .chain('exec')
      .resolves(sampleCommunity)

    return community.get('ID')
      .then((result) => {
        CommunityMock.verify()
        CommunityMock.restore()
        assert.equal(result, sampleCommunity)
      })
  })

  it('should update a community', function () {
    const CommunityMock = sinon.mock(Community)
    const save = sinon.spy(() => sampleCommunity)

    CommunityMock
      .expects('find').withArgs({ _id: 'ID' })
      .chain('exec')
      .resolves({ save })

    return community.update({ id: 'ID', community: {} })
      .then((result) => {
        CommunityMock.verify()
        CommunityMock.restore()
        sinon.assert.calledOnce(save)
        assert.equal(result, sampleCommunity)
      })
  })

  it('should remove a community', function () {
    const CommunityMock = sinon.mock(Community)
    const remove = sinon.spy()

    CommunityMock
      .expects('find').withArgs({ _id: 'ID' })
      .chain('exec')
      .resolves({ remove })

    return community.remove('ID')
      .then(() => {
        CommunityMock.verify()
        CommunityMock.restore()
        sinon.assert.calledOnce(remove)
      })
  })
})
