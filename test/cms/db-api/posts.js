const { Types: { ObjectId } } = require('mongoose')
const { assert } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')

const Post = require('../../../cms/models/post')
const post = require('../../../cms/db-api/posts')

const samplePost = {
  title: 'TITLE',
  content: 'CONTENT',
  reactionId: 'REACTION ID',
  author: 'AUTHOR',
  openingDate: Date.now(),
  closingDate: Date.now(),
  tags: ['tags']
}

describe('db-api.posts', function () {
  describe('#create', () => {
    it('should create a new post', function () {
      // require module with rewire to override its internal Post reference
      const post = rewire('../../../cms/db-api/posts')

      // replace User constructor for a spy
      const PostMock = sinon.spy()

      // add a save method that only returns the data
      PostMock.prototype.save = function () { return Promise.resolve(samplePost) }

      // create a spy for the save method
      const save = sinon.spy(PostMock.prototype, 'save')

      // override User inside `user/db-api/user`
      post.__set__('Post', PostMock)

      // call create method
      return post.create(samplePost)
        .then((result) => {
          sinon.assert.calledWith(PostMock, samplePost)
          sinon.assert.calledOnce(save)
          assert.equal(result, samplePost)
        })
    })
  })

  describe('#get', () => {
    it('should get a post from a given id', function () {
      const PostMock = sinon.mock(Post)

      PostMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(samplePost)

      return post.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          PostMock.verify()
          PostMock.restore()
          assert.equal(result, samplePost)
        })
    })
  })

  describe('#list', () => {
    it('should list all posts already saved', function () {
      const PostMock = sinon.mock(Post)

      PostMock
        .expects('paginate').withArgs({}, { limit: 10, page: 1 })
        .resolves(samplePost)

      return post.list({ limit: 10, page: 1 })
        .then((result) => {
          PostMock.verify()
          PostMock.restore()
          assert.equal(result, samplePost)
        })
    })
  })

  describe('#update', () => {
    it('should update a post', function () {
      const PostMock = sinon.mock(Post)
      const save = sinon.spy(() => samplePost)

      PostMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return post.update({ id: '5a5e29d948a9cc2fbeed02fa', title: {} })
        .then((result) => {
          PostMock.verify()
          PostMock.restore()
          sinon.assert.calledOnce(save)
          assert.equal(result, samplePost)
        })
    })
  })

  describe('#remove', () => {
    it('should remove a post', function () {
      const PostMock = sinon.mock(Post)
      const remove = sinon.spy()

      PostMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ remove })

      return post.remove('5a5e29d948a9cc2fbeed02fa')
        .then(() => {
          PostMock.verify()
          PostMock.restore()
          sinon.assert.calledOnce(remove)
        })
    })
  })
})
