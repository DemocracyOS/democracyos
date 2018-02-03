const {
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  TWITTER_KEY,
  TWITTER_SECRET,
  LINKEDIN_ID,
  LINKEDIN_SECRET,
  INSTAGRAM_ID,
  INSTAGRAM_SECRET
} = require('../../main/config')

module.exports = () => {
  let providers = []

  if (FACEBOOK_ID && FACEBOOK_SECRET) {
    providers.push({
      providerName: 'Facebook',
      providerOptions: {
        scope: ['email', 'public_profile']
      },
      Strategy: require('passport-facebook').Strategy,
      strategyOptions: {
        clientID: FACEBOOK_ID,
        clientSecret: FACEBOOK_SECRET,
        profileFields: ['id', 'displayName', 'email', 'link']
      },
      getProfile (profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile._json.email
        }
      }
    })
  }

  if (GOOGLE_ID && GOOGLE_SECRET) {
    providers.push({
      providerName: 'Google',
      providerOptions: {
        scope: ['profile', 'email']
      },
      Strategy: require('passport-google-oauth').OAuth2Strategy,
      strategyOptions: {
        clientID: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET
      },
      getProfile (profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        }
      }
    })
  }

  if (TWITTER_KEY && TWITTER_SECRET) {
    providers.push({
      providerName: 'Twitter',
      providerOptions: {
        scope: []
      },
      Strategy: require('passport-twitter').Strategy,
      strategyOptions: {
        consumerKey: TWITTER_KEY,
        consumerSecret: TWITTER_SECRET,
        userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
      },
      getProfile (profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: (profile.emails && profile.emails[0].value) ? profile.emails[0].value : ''
        }
      }
    })
  }

  if (LINKEDIN_ID && LINKEDIN_SECRET) {
    providers.push({
      providerName: 'LinkedIn',
      providerOptions: {
        scope: ['r_basicprofile', 'r_emailaddress']
      },
      Strategy: require('passport-linkedin-oauth2').Strategy,
      strategyOptions: {
        clientID: LINKEDIN_ID,
        clientSecret: LINKEDIN_SECRET
      },
      getProfile (profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile._json.emailAddress
        }
      }
    })
  }

  if (INSTAGRAM_ID && INSTAGRAM_SECRET) {
    providers.push({
      providerName: 'Instagram',
      providerOptions: {
        scope: []
      },
      Strategy: require('passport-instagram').Strategy,
      strategyOptions: {
        clientID: INSTAGRAM_ID,
        clientSecret: INSTAGRAM_SECRET
      },
      getProfile (profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: ''
        }
      }
    })
  }

  console.log('providers', providers)
  return providers
}
