(function(window) {
  $('.tag-typeahead').typeahead({
    source: ['ada', 'moma', 'tola'],
    updater: function (item) {
      alert(item);
      return item;
    }
  });
})(window);