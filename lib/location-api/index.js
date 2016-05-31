var log = require('debug')('democracyos:location-api');
var express = require('express');
var app = module.exports = express();
var location = require('../location');

/*
 * Doubts about Google Geolocation API? See https://developers.google.com/maps/documentation/geocoding/intro
 */

/*app.get('/locations/nearby', function (req, res) {
  var lat = req.body.lat;
  var lng = req.body.lng;

  request.get(url.reverseGeocoding({ lat: lat, lng: lng, apiKey: config.googleAPIKey }))
    .end(function (err, data) {
      if (err) {
        return res.json(403, err);
      } else if (data.body && data.body.error_message) {
        return res.json(403, data.body.error_message);
      }

      var locations = names(data.body.results.address_components);
      res.json(locations);
    });
});*/

app.get('/locations/search/:query', function (req, res) {
  var query = req.params.query;
  location.search(query, function (err, data) {
    if (err) return res.json(403, err);
    res.json(data);
  });
});
