/**
 * Expose function
 */

module.exports = isInViewport;

/**
 * Determine if the element is inside the viewport
 * 
 * @param el the element
 * @return {bool} true if the element is inside the viewport, false otherwise
 */
function isInViewport(el) {
  if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
  }

  var rect = el.getBoundingClientRect();

  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}