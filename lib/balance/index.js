var os = require('os');
var cluster = require('cluster');
var log = require('debug')('democracyos:balance');

/**
 * Expose balance
 */

module.exports = function balance(child) {
  return cluster.isMaster ? master() : child();
};

/**
 * Description
 */
function master() {
  log('master launch');
  var workerCount = os.cpus().length;
  var i = workerCount;

  cluster.on('death', function(worker) {
    log('master death');
    cluster.fork();
  });

  while(i--) {
    log('forking');
    cluster.fork();
  }
}