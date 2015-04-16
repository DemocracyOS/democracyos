var resolve = require('component-resolver');

var tree = null;
var pendings = [];
var resolving = false;

module.exports = function(fn){
  if (tree) return fn(null, tree);
  pendings.push(fn);
  if (resolving) return;

  resolving = true;
  resolveTree(function(err, _tree){
    if (err) throw err;

    resolving = false;
    tree = _tree;

    pendings.forEach(function(fn){
      setTimeout(function(){
        fn(null, _tree);
      }, 0);
    });
    pendings.length = 0;

    setTimeout(function(){
      tree = null;
    }, 2000);
  });
}

function resolveTree(fn){
  var options = {
    install: false,
    root: 'public'
  };

  resolve(process.cwd(), options, fn);
}
