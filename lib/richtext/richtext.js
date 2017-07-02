import dom from 'component-dom'
import Quill from 'democracyos-quill'
import merge from 'merge'
import debug from 'debug'
import View from '../view/view.js'
import template from './template.jade'

let log = debug('democracyos:richtext')

var defaults = {
  toolbar: {
    fontFace: false,
    fontSize: true,
    fontWidth: true,
    image: true,
    video: true,
    link: true,
    bullet: true,
    list: true
  },
  theme: 'snow'
}

/**
 * Wraps an input element and converts it in a Quill WYSIWYG control
 * @param {String|HTMLInputElement} Selector or domified single element
 * @param {Object} Customization options
 *
 * Usage:
 *   var richtext = require('richtext')
 *   var input = dom('input#description')
 *   richtext(input)
 *
 */

export default class RichTextView extends View {
  constructor (el, options = {}) {
    // The original input or textarea element
    let input = typeof el === 'string' ? dom(el) : el

    // Settings merged with options provided by callee
    let settings = merge(defaults, options, { inheritance: true })

    super(template, settings)
    this.input = input
    this.settings = settings
    // Set up Quill instance
    var modules = {
      'toolbar': { container: this.find('#toolbar')[0] }
    }

    if (this.settings.toolbar.link) modules['link-tooltip'] = true
    if (this.settings.toolbar.image) modules['image-tooltip'] = true
    if (this.settings.toolbar.video) modules['video-tooltip'] = true

    // Create Quill object
    this.editor = new Quill(this.find('#editor')[0], {
      modules: modules,
      theme: this.settings.theme,
      'styles': {
        '.ql-container': {
          'font-size': '16px'
        }
      }
    })

    // If original input element has value, set it to Quill object
    if (this.input.val()) {
      let html = this.input.val()
      this.editor.setHTML(html)
      log('Quill object was initialized with the following HTML: %s', html)
    } else {
      log('Quill object was initialized with no value')
    }

    this.render()
  }

  switchOn () {
    this.editor.on('text-change', this.bound('ontextchange'))
  }

  ontextchange () {
    var contents = this.editor.getHTML()
    log('Text has changed: %s', contents)
    this.input.val(contents)
  }

  render () {
    if (this.input) {
      this.input.addClass('hide')
      this.el.insertAfter(this.input)
    }

    return super.render()
  }
}
