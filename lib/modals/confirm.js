import nanoModal from 'nanomodal'
import t from 't-component'
import merge from 'mout/object/merge'
import { domRender } from '../render/render'
import template from './template.jade'

const defaultOptions = {
  text: t('modals.confirm.text'),
  acceptText: t('modals.confirm.accept'),
  cancelText: t('modals.confirm.cancel')
}

export default function confirm (options = {}) {
  if (typeof options === 'string') {
    options = { text: options.toString() }
  }

  const opts = merge(defaultOptions, options)
  const el = domRender(template, options)

  const modal = nanoModal(el, {
    classes: 'modals modals-confirm',
    buttons: [{
      text: opts.acceptText,
      classes: 'btn btn-danger',
      handler: function () {
        accept()
        modal.hide()
      }
    }, {
      text: opts.cancelText,
      classes: 'btn btn-default',
      handler: function () {
        reject()
        modal.hide()
      }
    }],
    autoRemove: true,
    overlayClose: true
  })

  /**
   * Primitive Promise-like interface
   * Enables use of handlers for modal acception or rejection.
   */

  let _accept = []
  let _reject = []
  let resolved = false

  function accept () {
    if (!resolved) _accept.forEach((cb) => { cb() })
    resolved = true
  }

  function reject () {
    if (!resolved) _reject.forEach((cb) => { cb() })
    resolved = true
  }

  modal.accepts = function (cb) { _accept.push(cb); return modal }
  modal.rejects = function (cb) { _reject.push(cb); return modal }

  /* - */

  modal.onHide(reject).show()

  return modal
}
