module.exports = function() {
  return /* localstorage || */ config('locale') || 'en';
};