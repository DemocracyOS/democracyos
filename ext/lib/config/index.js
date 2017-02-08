const path = require('path')
const democracyosConfig = require('democracyos-config')

module.exports = democracyosConfig({
  path: path.join(__dirname, '..', '..', 'config')
})
