/**
 * Module dependencies.
 */

var citizen = require('citizen');

module.exports = load;

try {
  // Include the UserVoice JavaScript SDK (only needed once on a page)
  UserVoice = window.UserVoice||[];(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/I6UGDI2yUpeL3wrG5QupZw.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})();
} catch (err) {
  console.log('Uservoice error: %s', err);
}

function load() {
  // Set colors
  UserVoice.push(['set', {
    accent_color: '#3498db',
    trigger_color: 'white',
    trigger_background_color: '#3498db',
    target: '#feedback',
    menu_enabled: true
  }]);

  // Autoprompt for Satisfaction and SmartVote (only displayed under certain conditions)
  UserVoice.push(['autoprompt', {}]);
}

module.exports.bind = function(selector) {
  selector = selector || '#feedback';

  UserVoice.removeTrigger && UserVoice.removeTrigger('#feedback');

  // Add default trigger to the bottom-right corner of the window:
  UserVoice.push(['addTrigger', '#feedback']);

  // Or, use your own custom trigger:
  //UserVoice.push(['addTrigger', '#id', { mode: 'contact' }]);
}

module.exports.user = function() {
  // Identify the user and pass traits
  // To enable, replace sample data with actual user traits and uncomment the line
  UserVoice.push(['identify', {
    email: citizen.logged() ? citizen.email : "", // User’s email address
    name: citizen.logged() ? citizen.fullName : "" // User’s real name
    //created_at: 1364406966, // Unix timestamp for the date the user signed up
    //id:         123, // Optional: Unique id of the user (if set, this should not change)
    //type:       'Owner', // Optional: segment your users by type
    //account: {
    //  id:           123, // Optional: associate multiple users with a single account
    //  name:         'Acme, Co.', // Account name
    //  created_at:   1364406966, // Unix timestamp for the date the account was created
    //  monthly_rate: 9.99, // Decimal; monthly rate of the account
    //  ltv:          1495.00, // Decimal; lifetime value of the account
    //  plan:         'Enhanced' // Plan name for the account
    //}
  }]);
}