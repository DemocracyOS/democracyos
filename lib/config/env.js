/**
 * Module dependencies.
 */

var env = process.env;

/**
 * Expose heroku helper
 */

module.exports = {
  host: env.HOST,
  port: parseInt(env.PORT, 10),
  mongoUrl: env.MONGOHQ_URL,
  auth: {
    facebook: {
      clientID: env.FB_CLIENT_ID,
      clientSecret: env.FB_CLIENT_SECRET,
      callback: env.FB_CALLBACK
    },
    twitter: {
      consumerKey: env.TW_CONSUMER_KEY,
      consumerSecret: env.TW_CONSUMER_SECRET,
      callback: env.TW_CALLBACK
    },
    basic: {
      username: env.BASIC_USERNAME,
      password: env.BASIC_PASSWORD
    }    
  },
  mailer: {
    service: env.MAILER_SERVICE,
    auth: {
      user: env.MAILER_USER,
      pass: env.MAILER_PASS
    }
  },
  mandrillMailer: {
    key: env.MANDRILL_APIKEY,
    from : {
      name: env.MANDRILL_FROM_NAME,
      email: env.MANDRILL_FROM_EMAIL
    }
  }
};