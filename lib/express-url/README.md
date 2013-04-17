## Description
Simple `url` view helper for multiple express apps.

## Usage
````javascript
var express = require('express')
  , app = express()
  , blog = express()
  , expressUrl = require('express-url'); // for now this is a private lib, but this require should work too.

// attach expressUrl helper to blog
blog.use(expressUrl(blog));

// define custom blog routes
// ...

// register `blog` under main `app`
app.use('/blog', blog)

// on a view from `blog`

a(href=url('/register')) //outputs '/blog/register'

````

That's it!