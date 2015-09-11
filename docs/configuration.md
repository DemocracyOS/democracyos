---
title: Configuration
position: 3
---

# Configuration

In order to run DemocracyOS, some config settings are needed. These settings can be defined either as a JSON file following the `config/defaults.json`, or through environment variables.

## Overriding Defaults

Default config options will be loaded from `/config/defaults.json`. Also it will be used as reference for the `Type` the values should have.

### Configuration Files

Environment specific options can be added using `/config/{NODE_ENV}.json`. E.g.: If your `NODE_ENV` is `development` and a file at `/config/development.json` exists, the options there will override the ones at `/config/defaults.json`.


You can generate configuration files using the command:

```
node ./bin/dos-install --config
```

Or, for other environment than `development`:

```
NODE_ENV=production node ./bin/dos-install --config
```

### Environment Variables

Environment Variables also can be used to override options (recommended for `production`). [Here's](https://help.ubuntu.com/community/EnvironmentVariables) explained how to manage environment variables on Linux/Mac.

* Var names should be `CONSTANT_CASE`.
  * e.g.: `mongoUrl` => `MONGO_URL`
  * Scoped variables e.g.: `notifications.url` => `NOTIFICATIONS_URL`
* `Arrays`s should be strings separated by commas.
  * e.g.: `"staff": ["mail@eg.com", "a@c.m"]` => `STAFF="mail@eg.com,a@c.m"`
* `Boolean` values should be `true` or `false`.
  * e.g.: `"rssEnabled": false` => `RSS_ENABLED="false"`

_* For more info, the values are casted using [`lib/config/cast-string.js`](https://github.com/DemocracyOS/app/blob/development/lib/config/cast-string.js)._

## Configuration Values

#### **locale**
* env: `LOCALE`
* default: `en`

Default language. The app will be in this language for the user, unless it has a valid `Accept-Language` header, or changes it on his Settings.

#### **availableLocales**
* env: `AVAILABLE_LOCALES`
* default: `[ ... ]`

Enabled languages. This are all the languages the user can select on the `/settings` page.

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

When this is `true`, the user will be able to register several times with the same email using alias like the [ones from Gmail](https://support.google.com/mail/answer/12096). Uses [Verigy](https://www.npmjs.com/package/verigy) module.

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

#### **client**
* env: `CLIENT`
* default: `[ ... ]`

Config options to be sended to the client, and usable from `/lib/config/config.js`. In most cases, this shouldn't be edited.

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


### Embebed Notifier Server

By default DemocracyOS uses an embeded [Notifier](https://github.com/DemocracyOS/notifier). This options are used to configure mailer transports (gmail, mailchimp, sendgrid, etc).

#### **notifications.mailer.service**
* env: `NOTIFICATIONS_MAILER_SERVICE`

Url of the Notifier server.

#### **notifications.mailer.auth.user**
* env: `NOTIFICATIONS_MAILER_AUTH_USER`

User for the [notifier](https://github.com/DemocracyOS/notifier) transport.

#### **notifications.mailer.auth.pass**
* env: `NOTIFICATIONS_MAILER_AUTH_USER`

Password for the [notifier](https://github.com/DemocracyOS/notifier) transport.


### External Notifier Server

In case you're using an external [Notifier Server](https://github.com/DemocracyOS/notifier-server), these are the options that need to be configured.

#### **notifications.url**
* env: `NOTIFICATIONS_URL`

Url of the Notifier server.

#### **notifications.token**
* env: `NOTIFICATIONS_TOKEN`

Token of the Notifier server.


### Facebook Login

Values needed to setup facebook login. For a complete guide on how to setup facebook login go to [Facebook Setup]().

#### **auth.facebook.username**
* env: `AUTH_FACEBOOK_CLIENT_ID`

App ID of your facebook app.

#### **auth.facebook.password**
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
