var config = require('lib/config');

module.exports.restrict = function authGitlabRestrict(req, res, next){
  if (config.gitlabSignin) {
    if (req.xhr) {
      res.send(403, { error: 'You can only singin with gitlab.' });
    } else {
      res.redirect('/');
    }
    return;
  }

  return next(); // eslint-disable-line consistent-return
};

module.exports.autologin = function authGitlabAutologin(req, res, next){
  if (config.gitlabSignin && config.autoSignin && !req.config.cookies.token) {
    res.redirect('/auth/gitlab');
  } else {
    next();
  }
};
