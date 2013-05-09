# Democracia En Red
DemocraciaEnRed is an online space for deliberation and voting on political proposals. The software aims to stimulate better arguments and come to better rulings.

![][1]
[1]: http://partidodelared.org/images/browser.png

## Requirements
* [MongoDB](http://www.mongodb.org/downloads)
* [NodeJS & NPM](http://nodejs.org/download)

## Install
1. Fork and/or clone or even just download this repository.
2. Set your configuration keys for twitter and facebook on `./config` (Check out documentation inside the directory).
3. Run `npm install` in the root of this application.
4. Run `make run` or `NODE_PATH=. node app.js`.

### Development Settings
In order to install a development instance of this applications, you need to `cp config.sample.json config.dev.json` into this very directory. Then set the following configuration variables:

#### Facebook Auth
#### Twitter Auth


### Production Settings
In order to install a development instance of this applications, you need to `cp config.sample.json config.json` into this very directory. Then set the following configuration variables:

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

## Useful links

* [PDR Site](http://partidodelared.org): The `Network Party` official site.
* [PDR Wiki](http://wiki.partidodelared.org): The `Network Party` official wiki.
* [PDR Facebook](http://facebook.com/partidodelared): The `Network Party` official Facebook page.
* [PDR Twitter](http://twitter.com/partidodelared): The `Network Party` official Twitter account.

## License 

(The MIT License)

Copyright (c) 2013 Democracia En Red &lt;hola@democraciaenred.org&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
