import nanoModal from 'nanomodal';
import t from 't-component';
import merge from 'mout/object/merge';
import { domRender } from '../render/render';
import template from './template.jade';

const defaultOptions = {
  text: t('confirm-modal.text'),
  acceptText: t('confirm-modal.accept'),
  cancelText: t('confirm-modal.cancel')
};

export default function confirmModal (options = {}) {
  const opts = merge(defaultOptions, options);
  const el = domRender(template, options);

  const modal = nanoModal(el, {
    classes: 'confirm-modal',
    buttons: [{
      text: opts.acceptText,
      classes: 'btn btn-danger',
      handler: function () {
        accept()
        modal.hide()
      }
    },{
      text: opts.cancelText,
      classes: 'btn btn-default',
      handler: function () {
        reject()
        modal.hide()
      }
    }],
    autoRemove: true,
    overlayClose: true
  });

  /**
   * Primitive Promise-like interface
   * Enables use of handlers for modal acception or rejection.
   */

  let _accept = []
  let _reject = []
  let resolved = false

  function accept () {
    if (!resolved) _accept.forEach((cb) => { cb() });
    resolved = true;
  }

  function reject () {
    if (!resolved) _reject.forEach((cb) => { cb() });
    resolved = true
  }

  modal.accepts = function (cb) { _accept.push(cb); return modal; };
  modal.rejects = function (cb) { _reject.push(cb); return modal; };

  /* - */

  modal.onHide(reject).show();

  return modal;
}
