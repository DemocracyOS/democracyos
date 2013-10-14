var express = require('express')

var app = module.exports = express();

module.exports.middleware = function (req, res, next) {
	if (!req.headers['user-agent'])) return next();
	if (/^Twitterbot/.test(req.headers['user-agent'])) {
		req.url = "/twitter-card/" + req.url;
	}
}

app.get('/twitter-card/*', function(req, res, next){
	
})