require('lib/models')()

const User = require('lib/models').User
const dbReady = require('lib/models').ready

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

exports.up = function up (done) {
  // firstName 100
  // lastName 100
  // username 100
  // email 200
  // badge 50

  dbReady()
    .then(() => User.collection
      .find({})
      .toArray()
      .then(mapPromises(function (user) {
        let firstNameInvalid = user.firstName && user.firstName.length > 100
        let lastNameInvalid = user.lastName && user.lastName.length > 100
        let usernameInvalid = user.username && user.username.length > 100
        let emailInvalid = user.email && user.email.length > 200
        let badgeInvalid = user.badge && user.badge.length > 50

        if (
          !firstNameInvalid &&
          !lastNameInvalid &&
          !usernameInvalid &&
          !emailInvalid &&
          !badgeInvalid
        ) {
          return Promise.resolve()
        }

        let firstName = firstNameInvalid ? user.firstName.slice(0, 100) : user.firstName
        let lastName = lastNameInvalid ? user.lastName.slice(0, 100) : user.lastName
        let username = usernameInvalid ? user.username.slice(0, 100) : user.username
        let email = emailInvalid ? user.email.slice(0, 200) : user.email
        let badge = badgeInvalid ? user.badge.slice(0, 50) : user.badge

        return User.collection.findOneAndUpdate({ _id: user._id }, {
          $set: {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            badge: badge
          }
        })
      }))
    )
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`update users maxlength from ${total} users succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('update users maxlength failed at ', err)
      done(err)
    })
}

exports.down = function down (done) {
  console.log('update users maxlength has no down migration')
  done()
}
