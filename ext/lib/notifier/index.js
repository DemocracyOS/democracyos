const notifier = require('democracyos-notifier')

// Wait until the notifier is initialized
const interval = setInterval(function () {
  if (!notifier.mailer) return

  clearInterval(interval)

  notifier.init().then(() => {
    ;[
      require('./jobs/welcome-email')
    ].forEach((job) => job(notifier))
  }).catch((err) => {
    console.error('Error loading ext/lib/notifier: ', err)
  })
}, 200)
