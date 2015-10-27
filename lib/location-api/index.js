var log = require('debug')('democracyos:location-api');
var request = require('superagent');
var config = require('../config');
var express = require('express');
var app = module.exports = express();

/*
 * Doubts about Google Geolocation API? See https://developers.google.com/maps/documentation/geocoding/intro
 */

var url = {
  geocoding: function (opts) {
    var urlTemplate = 'https://maps.googleapis.com/maps/api/geocode/json?address=:address&key=:key';
    return urlTemplate.replace(':address', opts.address)
      .replace(':key', opts.apiKey)
  },
  reverseGeocoding: function (opts) {
    var urlTemplate = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=:lat,:lng&key=:key';
    return urlTemplate.replace(':lat', opts.lat)
      .replace(':lng', opts.lng)
      .replace(':key', opts.apiKey);
  }
};

function normalize (location) {
  var scope;
  if (~location.types.indexOf('country')) {
    scope = 'country';
  } else if (~location.types.indexOf('administrative_area_level_1')) {
    scope = 'state';
  } else if (~location.types.indexOf('locality')) {
    scope = 'city';
  } else if (~location.types.indexOf('sublocality')) {
    scope = 'neighborhood';
  } else {
    scope = 'unknown';
  }

  return {
    externalId: location.place_id,
    name: location.formatted_address,
    coordinates: location.geometry.location,
    scope: scope
  };
}

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

  request.get(url.geocoding({ address: query, apiKey: config.googleAPIKey }))
    .end(function (err, data) {
      if (err) {
        return res.json(403, err);
      } else if (data.body && data.body.error_message) {
        return res.json(403, data.body.error_message);
      }
      var locations = data.body.results.map(normalize);
      res.json(locations);
    });
});
