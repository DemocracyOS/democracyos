const chai = require('chai')
const chaiHttp = require('chai-http')
const { Types: { ObjectId } } = require('mongoose')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const Post = require('../../../cms/models/post')

const expect = chai.expect
chai.use(chaiHttp)

describe('/api/v1.0/posts', () => {
  before(async () => {
    await require('../../../main')
  })

  beforeEach(async () => {
    await Post.remove({})
  })

  // const samplePost = {
  //   title: 'POST TITLE',
  //   content: 'POST CONTENT',
  //   author: ObjectId('5a5e29d948a9cc2fbeed02fa'),
  //   openingDate: Date.now(),
  //   closingDate: Date.now()
  // }

  // describe('#post', () => {
  //   it('should create a post', async () => {
  //     const res = await chai.request('http://localhost:3000')
  //       .post('/api/v1.0/posts')
  //       .send(samplePost)

  //     expect(res).to.have.status(CREATED)
  //   })
  // })

  // describe('#list', () => {
  //   it('should list all posts', async () => {
  //     const res = await chai.request('http://localhost:3000')
  //       .get('/api/v1.0/posts')
  //       .query({ limit: 10, page: 1 })

  //     expect(res).to.have.status(OK)

  //     const { results, pagination } = res.body

  //     expect(results).to.be.a('array')
  //     expect(results.length).to.be.eql(0)
  //     expect(pagination).to.have.property('count')
  //     expect(pagination).to.have.property('page')
  //     expect(pagination).to.have.property('limit')
  //   })
  // })

  // describe('#get', () => {
  //   it('should get a post by id', async () => {
  //     let newPost = await (new Post(samplePost)).save()
  //     const res = await chai.request('http://localhost:3000')
  //       .get(`/api/v1.0/posts/${newPost.id}`)

  //     expect(res).to.have.status(OK)
  //     expect(res.body).to.be.a('object')
  //     expect(res.body).to.have.property('title')
  //     expect(res.body).to.have.property('content')
  //     expect(res.body).to.have.property('author')
  //     expect(res.body).to.have.property('openingDate')
  //     expect(res.body).to.have.property('closingDate')
  //   })
  // })

  // describe('#put', () => {
  //   it('should update a post', async () => {
  //     let newPost = await (new Post(samplePost)).save()
  //     const res = await chai.request('http://localhost:3000')
  //       .put(`/api/v1.0/posts/${newPost.id}`)
  //       .send(Object.assign(samplePost, { title: 'Updated Title' }))

  //     expect(res).to.have.status(OK)
  //     expect(res.body).to.be.a('object')
  //     expect(res.body).to.have.property('title')
  //     expect(res.body).to.have.property('content')
  //     expect(res.body).to.have.property('author')
  //     expect(res.body).to.have.property('openingDate')
  //     expect(res.body).to.have.property('closingDate')
  //   })
  // })

  // describe('#delete', () => {
  //   it('should remove a post', async () => {
  //     let newPost = await (new Post(samplePost)).save()
  //     const res = await chai.request('http://localhost:3000')
  //       .delete(`/api/v1.0/posts/${newPost.id}`)

  //     expect(res).to.have.status(OK)
  //     expect(res.body).to.be.a('object')
  //     expect(res.body).to.have.property('id')
  //   })
  // })
})
