import Oy from 'oy-vey'
import ConfirmEmail from '../users/components/email/confirm'
const express = require('express')
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
  port: SMTP_PORT,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
}

const mailer = nodemailer.createTransport(options)

module.exports.send = ({
  email,
  subject,
  title,
  preview: previewText,
  data,
  template
}) => new Promise((resolve, reject) => {
  mailer.sendMail({
    to: email,
    from: SMTP_FROM_ADDRESS,
    subject: `${EMAIL_SUBJECT_PREFIX} ${subject}`,
    text: template.text,
    html: Oy.renderTemplate(<template.html {...data} />, { title, previewText })
  }, (err, info) => {
    if (err) return reject(err)
    resolve(info)
  })
})

module.exports.routes = (() => {
  const router = express.Router()

  router.get('/email/confirm', (req, res) => {
    res.send(Oy.renderTemplate(<ConfirmEmail.html url='url.with/token=342342' />, {
      title: 'Confirm email',
      headCSS: '@media ...',
      previewText: 'Confirm email to login'
    }))
  })

  return router
})()
