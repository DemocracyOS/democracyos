var request = require('superagent');
var config = require('../config');

var url = {
  geocoding: function (opts) {
    var urlTemplate = 'https://maps.googleapis.com/maps/api/geocode/json?address=:address&key=:key';
    return urlTemplate.replace(':address', opts.address)
      .replace(':key', opts.apiKey);
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

function first (arr) {
  if (!arr || !arr.length) return null;
  return arr[0];
}

module.exports.find = function (query, cb) {
  request.get(url.geocoding({ address: query, apiKey: config.googleAPIKey }))
    .end(function (err, data) {
      if (err) {
        return cb(err);
      } else if (data.body && data.body.error_message) {
        return cb(new Error(data.body.error_message));
      }

      var locations = data.body.results.map(normalize);
      return cb(null, locations);
    });
};

module.exports.findOne = function findOne (query, cb) {
  module.exports.find(query, function (err, data) {
    if (err) {
      return cb(err);
    }

    return cb(null, first(data));
  });
};

