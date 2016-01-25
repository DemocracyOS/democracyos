import nanoModal from 'nanomodal';
import merge from 'mout/object/merge';
import { domRender } from '../render/render';
import template from './template.jade';

const defaultOptions = {
  text: 'Are you Sure?',
  acceptText: 'Yes',
  cancelText: 'No'
};

export default function confirmModal (options = {}) {
  const opts = merge(defaultOptions, options);
  const el = domRender(template, options);

  return new Promise((accept, reject) => {
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

    modal.onHide(reject).show();
  })
}
