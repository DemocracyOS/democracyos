const winston = require('winston')
const expressWinston = require('express-winston')

const log = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'test' ? 'critic' : 'debug',
      colorize: true,
      timestamp: function () {
        return new Date().toISOString()
      }
    })
  ]
})

const middleware = expressWinston.logger({ winstonInstance: log })

module.exports = {
  log,
  middleware
}
