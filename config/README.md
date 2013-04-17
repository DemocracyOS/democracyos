## Development Settings
In order to install a development instance of this applications, you need to `cp config.sample.json config.dev.json` into this very directory. Then set the following configuration variables:

### Facebook Auth
### Twitter Auth


## Production Settings
In order to install a development instance of this applications, you need to `cp config.sample.json config.json` into this very directory. Then set the following configuration variables:

### Facebook Auth
### Twitter Auth


## Heroku Settings
In order to install this application with Heroku `PaaS` you shoud set `NODE_ENV=production` as well as the following config services:

### MongoDB
* MONGOHQ_URL: MongoDB add-on database url

### Facebook Auth
* FB_CLIENT_ID: Facebook application `ClientId`.
* FB_CLIENT_SECRET: Facebok application `ClientSecret`.
* FB_CALLBACK: Facebook application callback url. Eg: `http://yourdomain.org/auth/facebook/callback`

### Twitter Auth
* TW_CONSUMER_KEY: Twitter application `ConsumerKey`.
* TW_CONSUMER_SECRET: Twitter application `ConsumerSecret`.
* TW_CALLBACK: Twitter application callback url. Eg: `http://yourdomain.org/auth/twitter/callback`



