# DemocracyOS
DemocracyOS is an online space for deliberation and voting on political proposals. The software aims to stimulate better arguments and come to better rulings.

![][1]
[1]: https://dsz91cxz97a03.cloudfront.net/D3idav5d87-1200x1200.png

## Requirements
* [MongoDB](http://www.mongodb.org/downloads)
* [NodeJS & NPM](http://nodejs.org/download)
* [Component](http://github.com/component/component/wiki) `npm install -g component`

## Install

### For Unix Users
1. Fork and/or clone or even just download this repository.
2. Set your configuration keys for twitter and facebook on `./config` (Check out documentation below).
3. Run `make` or `make install && make run` in the root of this application.

### For others
1. Fork and/or clone or even just download this repository.
2. Set your configuration keys for twitter and facebook on `./config` (Check out documentation below).
3. Run `npm install` in the root of this application.
4. Run `component install` in the root of this application. (Or `./node_module/component/bin/component install`)
5. Run `make run` or `NODE_PATH=. node app.js`.

### Development Settings
In order to install a development instance of this applications, you need to:

1. `cp config.sample.json config.dev.json` into this very directory
2. Set `NODE_ENV` environment variable to `development`
3. Then set the following configuration variables:

#### Facebook Auth
You'll need a Facebook application in order to log in with a Facebook user; add your private values to `/config/config.dev.json`.

If you don't already have a Facebook application, you can create one free by going to http://developers.facebook.com and following [these easy steps](https://cloudup.com/c41pFaKcMBu).

Keep in mind that using separate Facebook applications for different environments (development, testing, production) is usually recommended.

### Testing Settings
In order to install a testing instance of this applications, you need to:

1. `cp config.sample.json config.testing.json` into this very directory. 
2. Set `NODE_ENV` environment variable to `testing`
3. Then set the following configuration variables:


### Production Settings
In order to install a production instance of this applications, you need to:

1. `cp config.sample.json config.json` into this very directory. 
2. Set `NODE_ENV` environment variable to `production`
3. Then set the following configuration variables:


### Heroku Settings
In order to install this application you shoud set the following config services:

#### MongoDB
* MONGOHQ_URL: MongoDB add-on database url

#### Facebook Auth
* FB_CLIENT_ID: Facebook application `ClientId`.
* FB_CLIENT_SECRET: Facebok application `ClientSecret`.
* FB_CALLBACK: Facebook application callback url. Eg: `http://yourdomain.org/auth/facebook/callback`

#### Twitter Auth
* TW_CONSUMER_KEY: Twitter application `ConsumerKey`.
* TW_CONSUMER_SECRET: Twitter application `ConsumerSecret`.
* TW_CALLBACK: Twitter application callback url. Eg: `http://yourdomain.org/auth/twitter/callback`

#### Mandrill Configuration (Mandrill is used to send transactional emails, eg password forgot/recovery email)
* MANDRILL_MAILER_KEY: Mandrill's API key
* MANDRILL_MAILER_FROM_NAME: Name of the "from" of emails
* MANDRILL_MAILER_FROM_EMAIL: Email of the "from" of emails

## Active Contributors
* [Ricardo Rauch](http://twitter.com/gravityonmars)
* [Cristian Douce Suarez](http://twitter.com/cristiandouce)
* [Guido Vilariño](http://twitter.com/gvilarino)

## Useful links

* [PDR Site](http://partidodelared.org): The `Net Party` official site.
* [PDR Wiki](http://wiki.partidodelared.org): The `Net Party` official wiki.
* [PDR Facebook](http://facebook.com/partidodelared): The `Net Party` official Facebook page.
* [PDR Twitter](http://twitter.com/partidodelared): The `Net Party` official Twitter account.

## License 

MIT
