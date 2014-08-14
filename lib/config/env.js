/**
 * Module dependencies.
 */

var env = process.env;

var on = ['on', 'true', '1'];
var defaultFalse = env == 'production' ? false : null;

/**
 * Expose heroku helper
 */

module.exports = {
  protocol: env.PROTOCOL,
  host: env.HOST,
  publicPort: env.PUBLIC_PORT,
  privatePort: env.PORT,
  mongoUrl: env.MONGOHQ_URL,
  client: env.CLIENT_CONF ? env.CLIENT_CONF.split(',') : [ "protocol", "host", "publicPort", "env", "locale", "logo", "favicon", "organization name", "organization url", "learn more url", "google analytics tracking id", "comments per page", "spam limit", "faq", "pp", "tos", "glossary" ],
  auth: {
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
  },
  socialshare : {
    siteName : env.SOCIALSHARE_SITE_NAME,
    siteDescription : env.SOCIALSHARE_SITE_DESCRIPTION,
    image : env.SOCIALSHARE_IMAGE,
    domain : env.SOCIALSHARE_DOMAIN,
    twitter : {
      username : env.SOCIALSHARE_TWITTER_USERNAME
    }
  },
  locale : env.LOCALE,
  logo : env.LOGO,
  favicon : env.FAVICON,
  "organization name" : env.ORGANIZATION_NAME,
  "organization url" : env.ORGANIZATION_URL,
  "learn more url" : env.LEARN_MORE_URL,
  "staff": env.STAFF ? env.STAFF.split(',') : null,
  "google analytics tracking id" : env.GOOGLE_ANALYTICS_TRACKING_ID,
  "rss enabled" : env.RSS_ENABLED,
  "comments per page": env.COMMENTS_PER_PAGE,
  "spam limit": env.SPAM_LIMIT,
  faq: env.FAQ ? !!~on.indexOf(env.FAQ.toLowerCase()) || !!env.FAQ : defaultFalse,
  tos: env.TERMS_OF_SERVICE ? !!~on.indexOf(env.TERMS_OF_SERVICE.toLowerCase()) || !!env.TERMS_OF_SERVICE : defaultFalse,
  pp: env.PRIVACY_POLICY ? !!~on.indexOf(env.PRIVACY_POLICY.toLowerCase()) || !!env.PRIVACY_POLICY : defaultFalse,
  glossary: env.GLOSSARY ? !!~on.indexOf(env.GLOSSARY.toLowerCase()) || !!env.GLOSSARY : defaultFalse
};