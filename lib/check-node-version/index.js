const check = require('check-node-version')
const config = require('lib/config')
const packageJson = require('../../package.json')

module.exports = function checkNodeVersion () {
  if (!config.checkNodeVersion) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const engines = Object.keys(packageJson.engines)

    check(packageJson.engines, (err, result) => {
      if (err) return reject(err)
      if (result.isSatisfied) return resolve(result)

      const msg = []

      msg.push('\n')

      engines.forEach((engine) => {
        const res = result[engine]
        if (res.isSatisfied) return

        msg.push(`Invalid '${engine}' version. You have '${res.version.version}' and '${res.wanted.range}' is required.`)
        msg.push(check.PROGRAMS[engine].getInstallInstructions(res.wanted.raw))
        msg.push('\n')
      })

      msg.push('Absolutely not recommended, but, if you want to disable this error just set "checkNodeVersion" to "false" in your configuration.')

      msg.push('\n')

      return reject(new Error(msg.join('\n')))
    })
  })
}
