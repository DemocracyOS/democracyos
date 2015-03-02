/**
 * Module dependencies.
 */

var env = process.env;

function on(variable, defaultValue) {
  return variable ? JSON.parse(variable) : defaultValue;
}

/**
 * Expose heroku helper
 */

module.exports = {
  protocol: env.PROTOCOL,
  host: env.HOST,
  publicPort: env.PUBLIC_PORT,
  privatePort: env.PORT,
  mongoUrl: env.MONGO_URL ? env.MONGO_URL : env.MONGOHQ_URL,
  mongoUsersUrl: env.MONGO_USERS_URL,
  "cors domains": env.CORS_DOMAINS,
  authPages: {
    signinUrl: on(env.EXTERNAL_SIGNIN_URL, ''),
    signupUrl: on(env.EXTERNAL_SIGNUP_URL, '')
  },
  client: env.CLIENT_CONF ? env.CLIENT_CONF.split(',') : [ "protocol", "host", "publicPort", "env", "locale", "logo", "favicon", "organization name", "organization url", "learn more url", "google analytics tracking id", "comments per page", "spam limit", "faq", "pp", "tos", "glossary", "authPages", "client debug" ],
  auth: {
    basic: {
      username: env.BASIC_USERNAME,
      password: env.BASIC_PASSWORD
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
  notifications: {
    url: env.NOTIFICATIONS_URL,
    token: env.NOTIFICATIONS_TOKEN
  },
  "organization name" : env.ORGANIZATION_NAME,
  "organization url" : env.ORGANIZATION_URL,
  "learn more url" : env.LEARN_MORE_URL,
  "staff": env.STAFF ? env.STAFF.split(',') : null,
  "google analytics tracking id" : env.GOOGLE_ANALYTICS_TRACKING_ID,
  "rss enabled" : env.RSS_ENABLED,
  "comments per page": on(env.COMMENTS_PER_PAGE, 0),
  "spam limit": env.SPAM_LIMIT,
  faq: on(env.FAQ),
  tos: on(env.TERMS_OF_SERVICE),
  pp: on(env.PRIVACY_POLICY),
  glossary: on(env.GLOSSARY),
  secret: env.JWT_SECRET,
  ssl: {
    port: on(env.HTTPS_PORT, 443),
    redirect: on(env.HTTPS_REDIRECT_MODE, 'normal'),
  },
  multicore: on(env.MULTICORE),
  "client debug": on(env.CLIENT_DEBUG)
};
