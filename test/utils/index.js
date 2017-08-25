var log = require('debug')('democracyos:test:utils')
var mongoose = require('mongoose')

// This requires an active Mongoose connection to work
require('lib/models')(mongoose.connection)
var User = require('lib/models').User
var Forum = require('lib/models').Forum

function createUser (user) {
  return new Promise(function (resolve, reject) {
    log('Creating user %s %s', user.firstName, user.lastName)
    var u = new User(user)
    u.save(function (err, doc) {
      log('Saving user %s %s', user.firstName, user.lastName)
      if (err) {
        log('Error saving user %s %s: %s', user.firstName, user.lastName, err)
        return reject(err)
      }

      log('User %s %s saved successfully', user.firstName, user.lastName)
      resolve(doc)
    })
  })
}

function createUsers (users) {
  return Promise.all(users.map(createUser))
}

function wipeUsers () {
  return new Promise(function (resolve, reject) {
    log('Removing all users')
    User.remove({}, function (err) {
      if (err) {
        log('Error removing all users: %s', err)
        return reject(err)
      }

      log('All users have been removed')
      resolve()
    })
  })
}

function createForum (forum) {
  return new Promise(function (resolve, reject) {
    log('Creating forum %s', forum.name)
    var f = new Forum(forum)
    f.save(function (err, doc) {
      if (err) {
        log('Error creating forum %s: %s', forum.name, err)
        return reject(err)
      }
      log('Forum %s created successfully', forum.name)
      resolve(doc)
    })
  })
}

function createForums (forums) {
  return Promise.all(forums.map(createForum))
}

function wipeForums () {
  return new Promise(function (resolve, reject) {
    log('Removing all forums')
    Forum.remove({}, function (err) {
      if (err) {
        log('Error removing all forums: %s', err)
        return reject(err)
      }

      log('All forums have been removed')
      resolve()
    })
  })
}

module.exports = {
  forums: {
    create: createForums,
    wipe: wipeForums
  },
  users: {
    create: createUsers,
    wipe: wipeUsers
  }
}
