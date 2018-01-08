const winston = require('winston')

let level = process.env.LOG_LEVEL || 'debug'
if (process.env.NODE_ENV === 'test') level = 'error'

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: level,
      colorize: true,
      timestamp: function () {
        return new Date().toISOString()
      }
    })
  ]
})

module.exports = logger
