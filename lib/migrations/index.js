const path = require('path')
const Migrator = require('migrate-mongoose')
const debug = require('debug')
const config = require('../config')

const log = debug('democracyos:migrations')

const migrator = module.exports.migrator = new Migrator({
  dbConnectionUri: config.mongoUrl,
  autosync: true,
  migrationsPath: path.resolve(__dirname, '..', '..', 'migrations')
})

/**
 * Make sure there are no pending migrations, and run them if necessary.
 * @method ready
 * @return Promise
 */
module.exports.ready = function ready () {
  return migrator.list()
    .then((migrations) => {
      const pending = migrations.filter((m) => m.state === 'down').length

      if (pending === 0) return

      log(`Running ${pending} migrations...`)

      return migrator.run()
    })
    .then(() => {
      log('Database migrations are up to date.')
    })
    .catch((err) => {
      throw err
    })
}
