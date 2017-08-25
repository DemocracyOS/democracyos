import nanoModal from 'nanomodal'
import FormView from '../../form-view/form-view'
import forumStore from '../../stores/forum-store/forum-store'
import template from './delete-modal.jade'

export default class DeleteForumModal extends FormView {
  /**
   * Creates a profile edit view
   */

  constructor (forum) {
    super(template, { forum: forum })
    this.forum = forum
    this.input = this.find('input.forum-name')
    this.button = this.find('button.ok')
    this.fire()
  }

  switchOn () {
    this.bind('input', '.forum-name', this.bound('onchange'))
    this.bind('click', '.close', this.bound('hide'))
    this.on('error', this.bound('error'))
    this.on('valid', this.bound('doDestroy'))
  }

  switchOff () {
    this.unbind()
    this.off('error')
  }

  fire () {
    this.modal = nanoModal(this.el[0], {
      classes: 'settings-forum-delete-modal',
      buttons: []
    })
    // this.modal.modal.add(this.el[0])
    this.show()
  }

  onchange () {
    if (this.input.val() === this.forum.name) {
      this.button.attr('disabled', null)
    } else {
      this.button.attr('disabled', true)
    }
  }

  error () {
    this.find('.form-messages').removeClass('hide')
  }

  show () {
    this.modal.show()
  }

  hide () {
    this.modal.hide()
  }

  doDestroy () {
    this.loading()

    forumStore.destroy(this.forum.id)
      .then(() => {
        this.hide()
        this.unloading()
        window.analytics.track('delete forum', { forum: this.forum.name })
      })
      .catch(() => {
        this.unloading()
      })
  }
}
