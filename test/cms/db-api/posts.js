const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')

const Post = require('../../../cms/models/post')
const post = require('../../../cms/db-api/posts')

const samplePost = {
  title: 'POST TITLE',
  description: 'POST DESCRIPTION',
  content: 'POST CONTENT'
}

describe('db-api.posts', () => {
  describe('#create', () => {
    it('should create a post', () => {
      // require module with rewire to override its internal Post reference
      const post = rewire('../../../cms/db-api/posts')

      // replace Post constructor for a spy
      const PostMock = sinon.spy()

      // add a save method that only returns the data
      PostMock.prototype.save = () => { return Promise.resolve(samplePost) }

      // create a spy for the save method
      const save = sinon.spy(PostMock.prototype, 'save')

      // override Post inside `cms/db-api/posts`
      post.__set__('Post', PostMock)

      // call create method
      return post.create(samplePost)
        .then((result) => {
          sinon.assert.calledWithNew(PostMock)
          sinon.assert.calledWith(PostMock, samplePost)
          sinon.assert.calledOnce(save)
          expect(result).to.equal(samplePost)
        })
    })
  })

  describe('#get', () => {
    it('should get a post', () => {
      const PostMock = sinon.mock(Post)

      PostMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves(samplePost)

      return post.get('5a5e29d948a9cc2fbeed02fa')
        .then((result) => {
          PostMock.verify()
          PostMock.restore()
          expect(result).to.equal(samplePost)
        })
    })
  })

  describe('#list', () => {
    it('should list all posts', () => {
      const PostMock = sinon.mock(Post)

      PostMock
        .expects('paginate').withArgs({}, { limit: 10, page: 1 })
        .resolves(samplePost)

      return post.list({ limit: 10, page: 1 })
        .then((result) => {
          PostMock.verify()
          PostMock.restore()
          expect(result).to.equal(samplePost)
        })
    })
  })

  describe('#update', () => {
    it('should update a post', () => {
      const PostMock = sinon.mock(Post)
      const save = sinon.spy(() => samplePost)

      PostMock
        .expects('findOne').withArgs({ _id: ObjectId('5a5e29d948a9cc2fbeed02fa') })
        .chain('exec')
        .resolves({ save })

      return post.update({ id: '5a5e29d948a9cc2fbeed02fa', post: {} })
        .then((result) => {
          PostMock.verify()
          PostMock.restore()
          sinon.assert.calledOnce(save)
          expect(result).to.equal(samplePost)
        })
    })
  })

  describe('#remove', () => {
    it('should remove a post', () => {
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
