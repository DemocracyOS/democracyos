// Requires winston lib for log
const { log } = require('../main/logger')
const settings = require('../cms/db-api/settings')
const {
  ErrSettingsNotInit,
  ErrSettingsInit
} = require ('../main/errors')

const setup = async (req, res, next) => {
  log.debug('setup middleware')
  try {
    await settings.getOne()
    next()
  } catch (e) {
    console.log(e)
    next()
  }
}

module.exports = {
  setup
}
