const nodemailer = require('nodemailer')
const {
  SMTP_HOST,
  SMTP_USERNAME,
  SMTP_PORT,
  SMTP_PASSWORD,
  SMTP_FROM_ADDRESS,
  EMAIL_SUBJECT_PREFIX
} = require('./config')

const options = {
  host: SMTP_HOST,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
}

if (SMTP_PORT) {
  try {
    options.port = parseInt(SMTP_PORT)
  } catch (e) {
    throw new Error('DEMOCRACYOS_SMTP_PORT is not an integer')
  }
} else {
  options.port = 25
}

const mailer = nodemailer.createTransport(options)

module.exports.send = (email, url) => new Promise((resolve, reject) => {
  console.log('about to send mail to ', email)
  mailer.sendMail({
    to: email,
    from: SMTP_FROM_ADDRESS,
    subject: `${EMAIL_SUBJECT_PREFIX} sign in`,
    text: `Use the link below to sign in:\n\n${url}\n\n`,
    html: `<p>Use the link below to sign in:</p><p>${url}</p>`
  }, (err, info) => {
    if (err) return reject(err)
    resolve(info)
  })
})
