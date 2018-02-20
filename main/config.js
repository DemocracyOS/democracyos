// This file serves as the entrypoint to all configuration loaded by the
// application. All defaults are assumed here, validation should also be
// completed here.

require('dotenv').config()

// ==============================================================================
//  CONFIG INITIALIZATION
// ==============================================================================

const CONFIG = {
  MONGO_URL: process.env.DEMOCRACYOS_MONGO_URL,

  PORT: parseInt(process.env.PORT, 10) || 3000,

  DEFAULT_LANG: process.env.DEMOCRACYOS_DEFAULT_LANG || 'en',

  EMAIL_SUBJECT_PREFIX: process.env.DEMOCRACYOS_EMAIL_SUBJECT_PREFIX || '[DemocracyOS]',

  SESSION_SECRET: process.env.DEMOCRACYOS_SESSION_SECRET || null,

  ROOT_URL: process.env.DEMOCRACYOS_ROOT_URL || null,

  // ------------------------------------------------------------------------------
  //  Identity providers
  // ------------------------------------------------------------------------------

  FACEBOOK_ID: process.env.DEMOCRACYOS_FACEBOOK_ID || null,
  FACEBOOK_SECRET: process.env.DEMOCRACYOS_FACEBOOK_SECRET || null,
  GOOGLE_ID: process.env.DEMOCRACYOS_GOOGLE_ID || null,
  GOOGLE_SECRET: process.env.DEMOCRACYOS_GOOGLE_SECRET || null,
  TWITTER_KEY: process.env.DEMOCRACYOS_TWITTER_KEY || null,
  TWITTER_SECRET: process.env.DEMOCRACYOS_TWITTER_SECRET || null,
  LINKEDIN_ID: process.env.DEMOCRACYOS_LINKEDIN_ID || null,
  LINKEDIN_SECRET: process.env.DEMOCRACYOS_LINKEDIN_SECRET || null,
  INSTAGRAM_ID: process.env.DEMOCRACYOS_INSTAGRAM_ID || null,
  INSTAGRAM_SECRET: process.env.DEMOCRACYOS_INSTAGRAM_SECRET || null,

  // ------------------------------------------------------------------------------
  //  SMTP Server configuration
  // ------------------------------------------------------------------------------

  SMTP_HOST: process.env.DEMOCRACYOS_SMTP_HOST,
  SMTP_USERNAME: process.env.DEMOCRACYOS_SMTP_USERNAME,
  SMTP_PORT: process.env.DEMOCRACYOS_SMTP_PORT || 25,
  SMTP_PASSWORD: process.env.DEMOCRACYOS_SMTP_PASSWORD,
  SMTP_FROM_ADDRESS: process.env.DEMOCRACYOS_SMTP_FROM_ADDRESS

}

// ==============================================================================
//  CONFIG VALIDATION
// ==============================================================================

if (process.env.NODE_ENV === 'test') {
  CONFIG.MONGO_URL = 'mongodb://localhost/DemocracyOS-test'
}

if (!CONFIG.SESSION_SECRET) {
  throw new Error(
    'DEMOCRACYOS_SESSION_SECRET must be provided in the environment to sign the session ID cookie'
  )
}

if (!CONFIG.SMTP_HOST || !CONFIG.SMTP_USERNAME || !CONFIG.SMTP_PASSWORD) {
  let missing = '\n---------------------------------'
  if (!CONFIG.SMTP_HOST) missing += '\n  DEMOCRACYOS_SMTP_HOST '
  if (!CONFIG.SMTP_USERNAME) missing += '\n  DEMOCRACYOS_SMTP_USERNAME '
  if (!CONFIG.SMTP_PASSWORD) missing += '\n  DEMOCRACYOS_SMTP_PASSWORD '
  missing += '\n---------------------------------'
  throw new Error(
    `An SMTP provider must be set to handle emails. \nMissing variables: ${missing}`
  )
}

module.exports = CONFIG
