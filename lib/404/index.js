var express = require('express');

var app = module.exports = express();

/**
 * GET Forum Show
 */

app.get('*', require('lib/layout'));
