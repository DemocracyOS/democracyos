import o from 'component-dom'
import wrap from 'democracyos-wrap'
import debug from 'debug'

let log = debug('democracyos:body-serializer')
const DATA_ID_ATTR = 'data-section-id'

function divToObject (div, position) {
  let obj = {}
  let id = div.attr(DATA_ID_ATTR)
  if (id) {
    obj.id = id
    div.removeAttr(DATA_ID_ATTR)
  }

  obj.markup = div[0].outerHTML
  obj.empty = !div.find('img').length && !div.text().trim()
  obj.position = position
  return obj
}

function paragraphToHTML (paragraph, options) {
  if (!paragraph) return ''
  var el = o(paragraph.markup)
  // Set the ID
  el.attr(DATA_ID_ATTR, paragraph.id)

  // Apply some transformations...
  if (typeof options === 'object') {
    if (options.className) {
      options.className
        .filter((cl) => !!cl)
        .forEach((cl) => el.addClass(cl))
    }
    if (options.iframeResponsive) {
      // Embed responsively
      var iframes = el.find('iframe')
      iframes.each((iframe) => wrap(iframe[0], o('<div class="embed-container"></div>')[0]))
    }
  // ... or custom ones
  } else if (typeof options === 'function') {
    options(el)
  }

  return el[0].outerHTML
}

/**
 * Transforms a List of HTML elements into a `Array` of `Object`
 * @param html The bare HTML elements, string or domified
 * @return `Array` of `Object`
 */

function deleteDuplicatedIDs (arr) {
  /**
   * Known issue: if you add a paragraph at the beginning, the second paragraph
   * will be interpreted as the new one. The side comments of the existing paragraph
   * will become the side comments of the first/new paragraph.
   */
  if (!arr || !arr.length) {
    return []
  }

  var clean = []
  var lastId = arr[0].id
  clean.push(arr[0])
  for (var i = 1; i < arr.length; i++) {
    var current = arr[i]
    if (current.id === lastId) {
      current.id = null
    } else {
      lastId = current.id
    }
    clean.push(current)
  }

  return clean
}

export function toArray (html) {
  function parse () {
    let el = o(html)
    let divs = el.find('div, li')
    // In the case `html` has just one DIV, the `find` method will return [],
    // so it's necessary to return the actual element
    if (divs.length === 0) divs = el
    return divs
  }

  let arr = []
  if (html) {
    let divs = parse(html)
    divs.each((div, i) => arr.push(divToObject(o(div), i)))
  }

  /**
   * Inserting new paragraphs makes Quill to duplicate the id references. We have to
   * traverse all the serialized objects and remove the duplicate ids. The new paragraphs
   * will be submitted with no ids so the server will interpret that are the new ones
   * and assign them a new id.
   */
  arr = deleteDuplicatedIDs(arr)

  log('toArray:\nhtml: %s\narray: %j', html, arr)
  return arr
}

/**
 * Transform an array of string into HTML code. Expects the strings in the array are valid HTML
 * @param paragraphs The actual array
 * @return A `String` representing HTML code
 */

export function toHTML (paragraphs, options) {
  if (Array.isArray(paragraphs)) {
    return paragraphs.map((paragraph) => paragraphToHTML(paragraph, options)).join('')
  } else {
    return paragraphToHTML(paragraphs, options)
  }
}
