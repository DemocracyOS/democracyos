/* eslint-env jasmine */

var request = require('supertest')
var app = require('lib/boot')
var users = require('test/assets/users.json')
var forums = require('test/assets/forums.json')
var fixtures = require('test/utils')

/**
 * Global variables and helper functions to handle data and permissions
 */

var forumId
var userId
var token

function signin (email) {
  return new Promise(function (resolve, reject) {
    request(app)
    .post('/api/signin')
    .send({ email: email, password: '123456' })
    .expect(200)
    .end(function (err, res) {
      if (err) return reject(err)
      token = getUserToken(res)
      resolve(res)
    })
  })
}

/**
 * Parses user token from `Response` object after a sign in
 * @param {Response} res - A `supertest` `Response` object
 * @return {String} The user token
 */

function getUserToken (res) {
  var token = res.headers['set-cookie'].toString().split(' ')[0].split('=')[1]
  token = token.substring(0, token.length - 1)
  return token
}

/**
 * Populates database with the data needed for this tests and also assigns needed global variables
 */

function populate () {
  return new Promise(function (resolve, reject) {
    fixtures.users.create(users)
    .then((u) => fixtures.forums.create(forums.map((f) => Object.assign(f, { owner: u[0].id }))))
    .then((forums) => {
      forumId = forums[0].id.toString()
      userId = forums[0].owner.toString()
      resolve()
    })
    .then(resolve)
    .catch(reject)
  })
}

/**
 * Tests
 */

describe('/api/forum/:id/permissions', function () {
  beforeAll(function (done) {
    populate()
      .then(signin('testuser1@example.com'))
      .then(done)
      .catch(console.error)
  })

  // with owner permissions
  it('as owner, should grant admin permission to other user', function (done) {
    var path = '/api/forum/' + forumId + '/permission'
    request(app)
      .post(path)
      .set('Cookie', 'token=' + token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ 'role': 'admin', user: userId })
      .expect(function (res) {
        expect(res.body.error).to.be.undefined()
        expect(res.body.permissions.find((p) => p.user === userId)).to.be.ok
      })
      .expect(200, done)
  })

  it('as owner, should decline admin permission to other user', function (done) {
    var path = '/api/forum/' + forumId + '/permission'
    request(app)
      .del(path)
      .set('Cookie', 'token=' + token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ 'role': 'admin', user: userId })
      .expect(function (res) {
        expect(res.body.error).to.be.undefined()
        expect(res.body.permissions.find((p) => p.user === userId)).to.not.be.ok
      })
      .expect(200, done)
  })

  afterAll(function (done) {
    Promise.all([
      fixtures.forums.wipe(),
      fixtures.users.wipe()
    ])
    .then(done)
    .catch(console.error)
  })
})
