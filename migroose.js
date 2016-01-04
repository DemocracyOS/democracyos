/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
var migroose = require('migroose')
var Runner = require('migroose-cli/cli/runner/index')

var MigrationModel = migroose.MigrationModel

module.exports.connect = function (callback){
  mongoose.connect('mongodb://localhost/DemocracyOS-dev', function (err) {
    if (err) { throw err }
    callback()
  })
}

module.exports.needsMigration = function needsMigration(callback) {
  var runner = new Runner(process.cwd(), 'migrootions')
  var migrations = runner.getMigrations()
  var lastMigration = migrations.slice(migrations.length - 1)[0]

  if (migrations.length === 0) return callback(null, false)

  MigrationModel.findOne({migrationId: lastMigration.migrationId}, function (err, model) {
    if (err) {
      return callback(err)
    }

    if (model) {
      callback(null, false)
    } else {
      callback(null, true)
    }
  })
}
