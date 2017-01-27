import nanoModal from 'nanomodal'
import t from 't-component'
import merge from 'mout/object/merge'
import { domRender } from '../render/render'
import template from './template.jade'

const defaultOptions = {
  text: t('modals.error.default'),
  closeText: t('common.ok')
}

export default function error (options = {}) {
  if (options instanceof Error || typeof options === 'string') {
    options = { text: options.toString() }
  }

  const opts = merge(defaultOptions, options)
  const el = domRender(template, opts)

  const modal = nanoModal(el, {
    classes: 'modals modals-confirm',
    buttons: [{
      text: opts.closeText,
      classes: 'btn btn-default',
      handler: 'hide'
    }],
    autoRemove: true,
    overlayClose: true
  })

  modal.show()

  return modal
}
