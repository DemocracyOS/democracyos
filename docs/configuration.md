---
title: Configuration
position: 3
---

# Configuration

In order to run DemocracyOS, some config settings are needed. Default values are listed on `config/defaults.json`.

> _WARNING: Never change values at `config/defaults.json`, to edit any value use the methods listed below._

## Configuring

### Configuration Files

Environment specific options can be added using `config/{NODE_ENV}.json`. E.g.: If your `NODE_ENV` is `development` you can use `config/development.json`, the options there will override the ones at `config/defaults.json`.


You can generate configuration files using the command:

```
NODE_ENV=development node ./bin/dos-install --config
```

### Environment Variables

Environment Variables also can be used to override options (recommended for `production`). [Here's](https://help.ubuntu.com/community/EnvironmentVariables) explained how to manage environment variables on Linux/Mac.

* Var names should be `CONSTANT_CASE`.
  * e.g.: `mongoUrl` => `MONGO_URL`
  * Scoped variables e.g.: `notifications.url` => `NOTIFICATIONS_URL`
* `Arrays` should be strings separated by commas.
  * e.g.: `"staff": ["mail@eg.com", "a@c.m"]` => `STAFF="mail@eg.com,a@c.m"`
* `Boolean` values should be `true` or `false`.
  * e.g.: `"rssEnabled": false` => `RSS_ENABLED="false"`

> _For more info, the values are casted using [`lib/config/cast-string.js`](https://github.com/DemocracyOS/app/blob/development/lib/config/cast-string.js)._

## Configuration Values

#### **locale**
* env: `LOCALE`
* default: `en`

Default language. The app will be in this language for the user, unless it has a valid `Accept-Language` header, or changes it on his Settings.

#### **availableLocales**
* env: `AVAILABLE_LOCALES`
* default: `[ ... ]`

Enabled languages. These are all the languages the user can select on the `/settings` page.

#### **protocol**
* env: `PROTOCOL`
* default: `http`

Base protocol to be considered when building application URLs. Change it to `https` for SSL-enabled servers.

#### **host**
* env: `HOST`
* default: `localhost`

Public accessible URL to your app. Used as base for internal URL building.

#### **publicPort**
* env: `PUBLIC_PORT`
* default: `3000`

Port where the application should listen, and to be considered when building application URLs.

#### **mongoUrl**
* env: `MONGO_URL`
* default: `mongodb://localhost/DemocracyOS-dev`

Full URL to your MongoDB storage solution. Including DB name.

#### **jwtSecret**
* env: `JWT_SECRET`

Secret signing key used for calculating and verifying the session signature. This value is required for encrypt and decrypt user sessions stored on cookies.

#### **corsDomains**
* env: `CORS_DOMAINS`
* default: `[]`

Domains allowed for `Cross-Origin` requests. Set it to `["*"]` to allow requests from everywhere.

#### **staff**
* env: `STAFF`
* default: `[]`

Users with emails listed here will have access to `/admin`, and will be able to edit Topics, Tags, Whitelist users, etc...

#### **allowEmailAliases**
* env: `ALLOW_EMAIL_ALIASES`
* default: `true`

When this is `true`, the user will be able to register several times with the same email using alias like the [ones from Gmail](https://support.google.com/mail/answer/22370). Uses [Verigy](https://www.npmjs.com/package/verigy) module.

#### **visibility**
* env: `VISIBILITY`
* default: `visible`
* options: `visible` | `hidden`

When `hidden` is selected, only registered users will be able to view the topics.

#### **usersWhitelist**
* env: `USERS_WHITELIST`
* default: `false`

If this option is set to `true`, only users listed on `/admin/users` will be able to signin/signup. This doesn't affect `staff` users.

#### **multiForum**
* env: `MULTI_FORUM`
* default: `false`

If this option is set to `true`, the application will be in a "hub" state and any user will be able to create it's own forum.

_**DISCLAIMER:** This option is in ALPHA state, expect a lot a changes not far away._

#### **defaultForum**
* env: `DEFAULT_FORUM`
* default: `""`

Optional value for setting an existent forum's name of a multiforum database for using it as a singleForum.

#### **client**
* env: `CLIENT`
* default: `[ ... ]`

Config options to be sended to the client, and usable from `/lib/config.js`. In most cases, this shouldn't be edited.

#### **forceSafeImageURLs**
* env: `FORCE_SAFE_IMAGE_URLS`
* default: `true`

When `true`, the protocol of images added to Topics will be forcefully changed to `config.protocol`.

#### **spamLimit**
* env: `SPAM_LIMIT`
* default: `5`

Absolute value of a negative score that an argument should reach to be flagged as spam.
For example, if the value is 5, all arguments with score less or equal to -5 will be flagged as spam.


### SSL

Values needed to use [SSL](https://es.wikipedia.org/wiki/Transport_Layer_Security). Go to the [SSL section](install.html#using-ssl) for installation instructions.

#### **https.serverKey**
* env: `HTTPS_SERVER_KEY`
* default: `server.key`

Path to ssl key file.

#### **https.serverCert**
* env: `HTTPS_SERVER_CERT`
* default: `server.crt`

Path to ssl certificate file.

#### **https.port**
* env: `HTTPS_PORT`
* default: `443`

Port where the `https` server will listen to.

#### **https.redirect**
* env: `HTTPS_REDIRECT`
* default: `normal`
* options: `normal` | `reverse-proxy` | `azure` | `no-redirect`

Proxy redirection type to be used when redirecting the user from `HTTP` to `HTTPS`. Possible options:
* `normal`: Normal redirection handled by the DemocracyOS nodejs server.
* `reverse-proxy`: Redirection to HTTPS compatible with reverse-proxies (e.g.: Heroku/Nodejitsu/nginx).
* `azure`: Redirection to HTTPS compatible with Windows Azure. Do NOT use outside Windows Azure; this can be easily spoofed outside their environment.
* `no-redirect`: The redirection is not handled. Meant to be used on development only.

### Let's Encrypt

Values needed to be able to validate a certificate generated using Let's Encrypt's Certbot service. To use it, setup the following configuration options and follow [this](https://github.com/DemocracyOS/express-certbot-endpoint) instructions.

#### **cerbot.key**
* env: `CERTBOT_KEY`

Certbot key needed when manually generating the certificate, should be something like `hvBj5jK2o3B6IpFhdrc8Q1OR6UeIl63_xXxXxXxXxXx`

#### **cerbot.token**
* env: `CERTBOT_TOKEN`

Certbot token needed when manually generating the certificate, should be something like `msbwzok5NNPLg2BjLBIGVali8utyXrc95xXxXxXxXxX`

### Embebed Notifier Server

By default DemocracyOS uses an embeded [Notifier](https://github.com/DemocracyOS/notifier). This options are used to configure mailer transports (gmail, mailchimp, sendgrid, etc).

#### **notifications.mailer.service**
* env: `NOTIFICATIONS_MAILER_SERVICE`

Notifier service. Any of [nodemailer-wellknown](https://github.com/andris9/nodemailer-wellknown#supported-services).

#### **notifications.mailer.auth.user**
* env: `NOTIFICATIONS_MAILER_AUTH_USER`

User for the [notifier](https://github.com/DemocracyOS/notifier) transport.

#### **notifications.mailer.auth.pass**
* env: `NOTIFICATIONS_MAILER_AUTH_PASS`

Password for the [notifier](https://github.com/DemocracyOS/notifier) transport.

#### **notifications.nodemailer**
* env: `NOTIFICATIONS_NODEMAILER`

Optional object that will override any nodemailer options for creating a mailerTransport.


### External Notifier Server

In case you're using an external [Notifier Server](https://github.com/DemocracyOS/notifier-server), these are the options that need to be configured.

#### **notifications.url**
* env: `NOTIFICATIONS_URL`

Url of the Notifier server.

#### **notifications.token**
* env: `NOTIFICATIONS_TOKEN`

Token of the Notifier server.


### Facebook Login

Values needed to setup facebook login. For a complete guide on how to setup facebook login go to [Facebook Setup](https://github.com/DemocracyOS/democracyos/wiki/Facebook-Signin-Signup).

#### **auth.facebook.clientID**
* env: `AUTH_FACEBOOK_CLIENT_ID`

App ID of your facebook app.

#### **auth.facebook.clientSecret**
* env: `AUTH_FACEBOOK_CLIENT_SECRET`

App Secret of your facebook app.

#### **auth.facebook.permissions**
* env: `AUTH_FACEBOOK_PERMISSIONS`
* default: `[ "email" ]`

Data to access from the user's facebook account. `email` is the only one needed for DemocracyOS. More info on [Facebook Permissions](https://developers.facebook.com/docs/facebook-login/permissions)


### Basic HTTP authentication

Values needed to setup [Basic HTTP authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) on the application.

#### **auth.basic.username**
* env: `AUTH_BASIC_USERNAME`

Authentication Username.

#### **auth.basic.password**
* env: `AUTH_BASIC_PASSWORD`

Authentication Password.


### Independant Users Database

Values only needed if you want to have a different database for `users`. This allows, for example, to have different instances of DemocracyOS but share the same `users` collection, so they could register only once.

#### **mongoUsersUrl**
* env: `MONGO_USERS_URL`

Full URL to your MongoDB storage solution.

#### **signinUrl**
* env: `SIGNIN_URL`

URL to redirect the users when gets to the signin page (`/singin`).

#### **signupUrl**
* env: `SIGNUP_URL`

URL to redirect the users when gets to the signup page (`/signup`).

#### **settingsUrl**
* env: `SETTINGS_URL`

URL to redirect the users when gets to the settings page (`/settings`).


### User Tracking

#### **googleAnalyticsTrackingId**
* env: `GOOGLE_ANALYTICS_TRACKING_ID`

Set this options to enable [Google Analytics](http://www.google.com/analytics/) tracking.

#### **segmentKey**
* env: `SEGMENT_KEY`

Set this options to enable [Segment](https://segment.com/) tracking.


### Application Styles

#### **logo**
* env: `LOGO`
* default: `/boot/logo.png`

URL of the logo to be used on the header.

#### **logoMobile**
* env: `LOGO_MOBILE`
* default: `/boot/logo-mobile.png`

Optional, URL of the logo to be used on the header when the width of the screen is less than `700px`.

#### **homeLink**
* env: `HOME_LINK`
* default: `/`

Where to take the user when click the `logo` on header.

#### **favicon**
* env: `FAVICON`
* default: `/boot/favicon.ico`

URL of the [favicon](https://es.wikipedia.org/wiki/Favicon).

#### **organizationName**
* env: `ORGANIZATION_NAME`
* default: `DemocracyOS on GitHub`

Title of the app to be shown on the right side of the header.

#### **organizationUrl**
* env: `ORGANIZATION_URL`
* default: `https://github.com/DemocracyOS/app`

Link to take the user when clicks on `organizationName`.

#### **organizationEmail**
* env: `ORGANIZATION_EMAIL`
* default: `no-reply@democracyos.org`

Sender email to show on all email notifications.

#### **headerBackgroundColor**
* env: `HEADER_BACKGROUND_COLOR`
* default: `#7d4489`

Background color of the header.

#### **headerFontColor**
* env: `HEADER_FONT_COLOR`
* default: `#fff`

Color of the header's texts.

#### **headerContrast**
* env: `HEADER_CONTRAST`
* default: `false`

When `true` will add a little shadow to the header. Recommended to be used when the color of the header doesn't create contrast with the white background.


### Static Pages

#### **frequentlyAskedQuestions**
* env: `FREQUENTLY_ASKED_QUESTIONS`
* default: false

When `true` will enable the route under `/help/faq` in which the content of `lib/help-faq/faq.md` is going to be shown

#### **termsOfService**
* env: `TERMS_OF_SERVICE`
* default: false

When `true` will enable the route under `/help/terms-of-service` in which the content of `lib/help-tos/tos.md` is going to be shown

#### **privacyPolicy**
* env: `PRIVACY_POLICY`
* default: false

When `true` will enable the route under `/help/privacy-policy` in which the content of `lib/help-pp/pp.md` is going to be shown

#### **glossary**
* env: `GLOSSARY`
* default: false

When `true` will enable the route under `/help/privacy-policy` in which the content of `lib/help-pp/pp.md` is going to be shown

### In-App featuresn

#### **facebookSignin**
* env: `FACEBOOK_SIGNIN`
* default: false

When `true` will enable signin/signup using Facbook instead of the default email and password.

#### **learnMoreUrl**
* env: `LEARN_MORE_URL`
* default: ""

Link to any URL explaining more about the particular DemocracyOS instance or any other thing that wants to be clarified as the institution using it or any kind of impact on the real world the decision arrived on the software will have.

#### **tweetText**
* env: `TWEET_TEXT`
* default: ""

Text used when sharing a topic on Twitter

#### **googleAPIKey**
* env: `GOOGLE_API_KEY`
* default: ""

Key (string) used by [google-translate](https://github.com/Localize/node-google-translate) use [Google Translator](https://cloud.google.com/translate/v2/getting_started?hl=en) in order to use the command in `bin/dos-translate`

### Social sharing

This settings will be used when sharing a link on Facebook or Twitter.

They are used in `lib/facebook-card` and `lib/twitter-card` modules to generate the proper HTML.

#### **siteName**
* env: `SOCIALSHARE_SITE_NAME`
* default: "DemocracyOS"

#### **siteDescription**
* env: `SOCIALSHARE_SITE_DESCRIPTION`
* default: "DemocracyOS voting system"

#### **image**
* env: `SOCIALSHARE_IMAGE`
* default: "https://2.gravatar.com/avatar/a8b9176bd0d042db078bf38500727671?d=https%3A%2F%2Fidenticons.github.com%2F14bae9f2564556f8eb23cc263a779f59.png&s=400"

#### **domain**
* env: `SOCIALSHARE_DOMAIN`
* default: "democracyos.org"

#### **twitter.username**
* env: `SOCIALSHARE_TWITTER_USERNAME`
* default: "@democracyos"
