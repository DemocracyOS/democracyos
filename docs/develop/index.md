---
title: Develop
---

DemocracyOS development guide
==========================

We'll be using version `^1.0.0` of DemocracyOS.

# Stack

#### Node.js and NPM
You need [Node.js v4.0.0](https://nodejs.org/en/blog/release/v4.0.0/) or greater to run DemocracyOS.

There are many options out there to get it installed:

* [Official site](https://nodejs.org/en/download/): both Node.js and NPM come bundled with this installation.

* [NVM](https://github.com/creationix/nvm): Node Version Manager - Simple bash script to manage multiple active node.js versions

* [tj/n](https://github.com/tj/n): another -yet simpler- node version manager


#### MongoDB

We also support the [latest version](http://blog.mongodb.org/post/130823293808/mongodb-319-is-released) of [MongoDB](https://www.mongodb.org/).

So [download](https://www.mongodb.org/downloads) the version for your system and follow the installation instructions to get it running.

```
Note: we are planning on using Docker for both development and production so start developing on a new machine is easy as pie and we can run the app with the same environment that in production.
```

#### Browserify

We use [Browserify](http://browserify.org) to bundle all our client side code, but we use it as a dependency so you don't need to install anything.

#### Operating System

We currently don't support Windows, so if you're running it please install VirtualBox with a Linux distribution. We prefer Ubuntu as we know DemocracyOS runs on it.

# Configuration

All the configuration variables are on the `/config/defaults.json` file. If you want to override any of them, you should create a new file called `development.json` on the same directory and re-write the name and the value you want.

Also, to pass configuration variables to the client we use the `client` key, which accepts an array of other configuration variable names.

So if you want to add a new variable called `example` and pass it to the client, the steps are:
1. Add the key-value pair to the `defaults.json` file, the key should be `example` and the value whatever you want. It must have a default value, even if it is an empty string.
2. If you want to pass that variable to the client, then add `'example'` to the client array in that same file.
3. If you want to test with a different value for the `example` variable, create a `development.json` file in the same directory and override the default value.

Configuration variable names must be `camelCased` as in production we match Environment Variables with Configuration Variables in this way:

In defaults.json:
```
{
  ...
  myVariable: 'default',
  myOtherVariable: {
    someProperty: 10
  }
  ...

}
```
In production, those environment variables must be:
```
MY_VARIABLE="not default"
MY_OTHER_VARIABLE_SOME_PROPERTY=20
```
As you can see, we match camelCase and nested objects with underscores, and we infer the type using the `defaults.json` file (`myVariable` is a `string` and `someProperty` is a number in this case).

# Running the app

DemocracyOS can be run in many ways, but we prefer just using `make` on the project root folder.

Another way can be running `gulp bws` for development, that will wait for changes on the project files to rebuild every time. For that, we must have `gulp` installed:

```
npm install -g gulp
```

# Models

All our data is stored in MongoDB and to connect with it we use [mongoose](http://mongoosejs.com/), an elegant mongodb object modeling for node.js.

Models are store on `lib/models` directory. If you want to add a new model, then do it in a new file under that directory following a similar structure as the models we have.

After that `require` it in `lib/models/index.js`.

# Database-API

For creating, reading, updating and destroying models we have a data layer which interacts with the models. It's called `db-api` and it's located under `lib/db-api`.

After creating a new model, you should include a new file under the `lib/db-api` directory with its name and `export`ing methods for:

* create
* search
* all
* findOne
* destroy
* update
* custom operation

You can take a look at the current `db-api`s we have under that directory to see some examples.

# Web API

We expose those calls from the database api via a restful api. Each `model` have a different file that follows the convention `lib/${modelName}-api/index.js`, for example: `lib/topic-api/index.js`.

These modules are added to the app on `lib/boot/index.js` and you should add them like:

```
app.use('/api', require('lib/${modelName}-api'));
```

So it can be accessed on the client on the URL: `/api/modelName`.

# Routing

### Server Side

If you want to add a new route to DemocracyOS, first thing to do is to create a new module under `lib` for it and expose an `app` (an `express` instance) that requires `lib/layout`. For example:

In `lib/mypage/index.js`
```
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

app.get('/mypage', require('lib/layout'));
```

And at the bottom of `lib/boot/index.js`
```
app.use(require('lib/mypage'));
```

### Client Side

For client side routing, we use [page.js](https://github.com/visionmedia/page.js), a micro client-side router inspired by the Express router.

You should create a new file on `lib/mypage/mypage.js` and include the following lines:

```
import page from 'page';

page('/mypage', (ctx, next) => {
  // your page logic goes here
});
```

If you are creating a page for displaying content (and not topics) you should first empty and then render everything inside the `#content` element. You can do that simply with [component-dom](https://github.com/component/dom):

```
import o from 'component-dom';
import page from 'page';
import MyPageView from './view';

page('/mypage', (ctx, next) => {
  let myPage = new MyPageView();

  let el = o('#content');
  myPage.appendTo(el[0]);
});
```

Which leads us to... views.

# Views

To create new views (the HTML that you will show to the end user) start by creating a new file inside `lib/mypage` called `view.js`. This is if you also have a route called that way, but if you don't you can just create it under `lib/my-view/view.js`.

We have our own `View` library under `lib/view/view.js` which provides you with methods for:

* `constructor`: pass a template and locals for that template
* `switchOn`: function called when the template is rendered in the DOM
* `switchOff`: function called when the template is removed from the DOM
* `appendTo`: appends the created element inside the passed element
* `bind`: used to bind event handlers
* others that you can see on `lib/view/view.js`

You shouldn't be touching this file but instead you should extend your own views from it:

```
import View from '../view/view.js';
import template from './template.jade';

export default class MyView extends View {

  constructor (topic) {
    super(template, { topic });
  }
}
```

# Templates

On the previous example, we used a template. This file is written in [jade](http://jade-lang.com/) format and it should have one and only one container element. If you write something like:

```
.topic-container
  .topic-body
    // ...
.comments
  .comment-form
    // ...
```

You have two root containers (`topic-container` and `.comments`) and you will run into problems with that. Templates can be passed in data on the `locals` objects: on the view when you call `super(template, locals)`.

# Stores

Stores are the responsible for communicating with the server side API to get the needed data. A store must have a `name` function defined returning the name of the model that's related to, because it is used to build up the API URL.

For making requests to the server we use our own mode on `lib/request/request.js` which uses [superagent](https://github.com/visionmedia/superagent).

As with the Views, if you create a new store you should extend `lib/store/store.js`.

```
import Store from '../store/store';

class MyModelStore extends Store {
  name() {
    return 'myModel'; // calls will be made to '/api/myModel'
  }
}
```

That store comes already bundled with methods like:

* findOne
* findAll
* destroy

Store uses [Promises](http://babeljs.io/docs/learn-es2015/) to make async calls, caching the promises on a private variable called `_fetches`.

To see a full example of a customized store, you can see `lib/topic-store/topic-store.js`.

# Middlewares

You will probably need the data on your pages, for that you can create a custom [middleware](https://github.com/visionmedia/page.js#routing) function.

To keep things organized we have created some modules like `lib/topic-middlewares/topic-middlewares.js`.

Under the routes that need data, you should include these middlewares and probably you will be using a store for making those calls.

When the data is ready, then you should call `next` on that middleware, for example:

```
export function findMyModel(ctx, next) {
  myModelStore
    .findOne(ctx.params.id)
    .then(model => {
      ctx.model = model;
      next();
    })
    .catch(err => {
      if (404 !== err.status) throw err;
      log(`Unable to load model for ${ctx.params.id}`);
    });
}
```