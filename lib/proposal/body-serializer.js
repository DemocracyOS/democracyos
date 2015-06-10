import o from 'component-dom';

/**
 * Transforms a List of HTML elements into a `Array` of `String`
 * @param html The bare HTML elements, string or domified
 * @return `Array` of `String`
 */

export function toArray (html) {
  return o(html).find('div, li').map(div => div.outerHTML);
}

/**
 * Transform an array of string into HTML code. Expects the strings in the array are valid HTML
 * @param arr The actual array
 * @return A `String` representing HTML code
 */

export function toHTML (arr) {
  return arr.join('');
}
