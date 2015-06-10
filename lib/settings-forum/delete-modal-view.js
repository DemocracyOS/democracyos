import debug from 'debug';
import page from 'page';
import modal from 'nanomodal';
import FormView from '../form-view/form-view';
import template from './delete-modal.jade';

let log = debug('democracyos:settings-forums');

export default class DeleteForumModal extends FormView {

  /**
   * Creates a profile edit view
   */

  constructor (forum) {
    super(template, { forum: forum });
    this.forum = forum;
    this.input = this.find('input.forum-name');
    this.button = this.find('button.ok');
    this.fire();
  }

  switchOn () {
    this.bind('input', '.forum-name', this.bound('onchange'));
    this.bind('click', '.close', this.bound('hide'));
    this.on('success', this.bound('onsuccess'));
    this.on('error', this.bound('error'));
  }

  switchOff () {
    this.unbind();
    this.off('success');
    this.off('error');
  }

  fire () {
    this.modal = modal('', { buttons: [] });
    this.modal.modal.add(this.el[0]);
    this.modal.show();
  }

  onchange (ev) {
    if (this.input.val() == this.forum.attr('name')) {
      this.button.attr('disabled', null);
    } else {
      this.button.attr('disabled', true);
    }
  }

  error () {
    this.find('.form-messages').removeClass('hide');
  }

  hide () {
    this.modal.hide();
  }

  /**
   * Show success message
   */

  onsuccess () {
    this.hide();
    this.forum.status('non-existent');
    this.emit('deleted');
  }
}
