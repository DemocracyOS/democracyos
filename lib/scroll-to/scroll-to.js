var scrollTo = require("scroll-to");
var o = require('dom');

/**
 * Expose function
 */
module.exports = scroll;

/**
 * Determine if the element is inside the viewport
 * 
 * @param el the element
 * @return {bool} true if the element is inside the viewport, false otherwise
 */
function scroll(el) {
  if(!el) return;

  var top = el.offsetHeight 
            + el.getBoundingClientRect().top 
            - (window.innerHeight || document.documentElement.clientHeight)
            + 25 /* margin */;
  var options = { box: o('#browser')[0]};
  return scrollTo(null, top, options);
}