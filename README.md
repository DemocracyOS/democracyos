# Democracia En Red
DemocraciaEnRed is an online space for deliberation and voting on political proposals. The software aims to stimulate better arguments and come to better rulings.

![][1]
[1]: http://partidodelared.org/images/browser.png

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
In order to install a development instance of this applications, you need to 
1. `cp config.sample.json config.dev.json` into this very directory
2. Set `NODE_ENV` environment variable to `development`
3. Then set the following configuration variables:

#### Facebook Auth
#### Twitter Auth

### Testing Settings
In order to install a testing instance of this applications, you need to 
1. `cp config.sample.json config.testing.json` into this very directory. 
2. Set `NODE_ENV` environment variable to `testing`
3. Then set the following configuration variables:

#### Facebook Auth
#### Twitter Auth


### Production Settings
In order to install a production instance of this applications, you need to 
1. `cp config.sample.json config.json` into this very directory. 
2. Set `NODE_ENV` environment variable to `production`
3. Then set the following configuration variables:

#### Facebook Auth
#### Twitter Auth


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

## Active Contributors
* [Ricardo Rauch](http://twitter.com/gravityonmars)
* [Cristian Douce Suarez](http://twitter.com/cristiandouce)
* [Guido Vilarino](http://twitter.com/gvilarino)

## Useful links

* [PDR Site](http://partidodelared.org): The `Network Party` official site.
* [PDR Wiki](http://wiki.partidodelared.org): The `Network Party` official wiki.
* [PDR Facebook](http://facebook.com/partidodelared): The `Network Party` official Facebook page.
* [PDR Twitter](http://twitter.com/partidodelared): The `Network Party` official Twitter account.

## License 

MIT
