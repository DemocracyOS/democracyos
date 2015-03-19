/**
 * Module dependencies.
 */

var env = process.env;

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
  'deployment id': env.DEPLOYMENT_ID,
  'cors domains': env.CORS_DOMAINS ? env.CORS_DOMAINS.split(',') : null,
  'signin url': env.EXTERNAL_SIGNIN_URL,
  'signup url': env.EXTERNAL_SIGNUP_URL,
  'settings url': env.EXTERNAL_SETTINGS_URL,
  client: env.CLIENT_CONF ? env.CLIENT_CONF.split(',') : [ 'protocol', 'host', 'publicPort', 'env', 'locale', 'logo', 'logo mobile', 'favicon', 'organization name', 'organization url', 'learn more url', 'google analytics tracking id', 'comments per page', 'spam limit', 'faq', 'pp', 'tos', 'glossary', 'signin url', 'signup url', 'settings url', 'logout url', 'client debug', 'home link' ],
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
  "logo mobile" : env.LOGO_MOBILE,
  favicon : env.FAVICON,
  notifications: {
    url: env.NOTIFICATIONS_URL,
    token: env.NOTIFICATIONS_TOKEN
  },
  'organization name' : env.ORGANIZATION_NAME,
  'organization url' : env.ORGANIZATION_URL,
  'learn more url' : env.LEARN_MORE_URL,
  'staff': env.STAFF ? env.STAFF.split(',') : null,
  'google analytics tracking id' : env.GOOGLE_ANALYTICS_TRACKING_ID,
  'rss enabled' : env.RSS_ENABLED,
  'comments per page': env.COMMENTS_PER_PAGE,
  'spam limit': env.SPAM_LIMIT,
  faq: env.FAQ,
  tos: env.TERMS_OF_SERVICE,
  pp: env.PRIVACY_POLICY,
  glossary: env.GLOSSARY,
  secret: env.JWT_SECRET,
  'home link': env.HOME_LINK,
  ssl: {
    port: env.HTTPS_PORT,
    redirect: env.HTTPS_REDIRECT_MODE,
  },
  'client debug': env.CLIENT_DEBUG
};
