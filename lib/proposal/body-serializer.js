import o from 'component-dom';

function divToObject (div) {
  var obj = {};
  if (div.attr('data-id')) {
    obj.id = div.attr('data-id');
    div.attr('data-id', '');
  }

  obj.markup = div[0].outerHTML;
  return obj;
}

function paragraphToHTML (paragraph) {
  var el = o(paragraph.markup);
  el.attr('data-id', paragraph.id);
  return el[0].outerHTML;
}

/**
 * Transforms a List of HTML elements into a `Array` of `Object`
 * @param html The bare HTML elements, string or domified
 * @return `Array` of `Object`
 */

export function toArray (html) {
  var arr = [];
  o(html)
    .find('div, li')
    .each(div => arr.push(divToObject(o(div))));
  return arr;
}

/**
 * Transform an array of string into HTML code. Expects the strings in the array are valid HTML
 * @param paragraphs The actual array
 * @return A `String` representing HTML code
 */

export function toHTML (paragraphs) {
  return paragraphs.map(paragraph => paragraphToHTML(paragraph)).join('');
}
