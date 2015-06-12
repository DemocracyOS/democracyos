import o from 'component-dom';
import debug from 'debug';

let log = debug('democracyos:body-serializer');

function divToObject (div) {
  var obj = {};
  if (div.attr('data-id')) {
    obj.id = div.attr('data-id');
    div.attr('data-id', '');
  }

  obj.markup = div[0].outerHTML;
  return obj;
}

function paragraphToHTML (paragraph, options) {
  var el = o(paragraph.markup);
  el.attr('data-id', paragraph.id);
  if ('object' === typeof options && options.className) {
    options.className
      .filter(cl => !!cl)
      .forEach(cl => el.addClass(cl));
  }
  if ('function' === typeof options) {
    options(el);
  }

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

export function toHTML (paragraphs, options) {
  if (paragraphs instanceof Array) return paragraphs.map(paragraph => paragraphToHTML(paragraph, options)).join('');
  else return paragraphToHTML(paragraphs, options);
}
