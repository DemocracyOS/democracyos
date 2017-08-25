import View from '../../view/view'
import template from './forum-row.jade'
import DeleteForumModal from './delete-modal-view'

export default class ForumRowView extends View {
  /**
   * Creates a profile edit view
   */

  constructor (forum) {
    super(template, { forum: forum })
    this.forum = forum
    this.deleteModal = null
  }

  switchOn () {
    this.bind('click', '.btn-remove', this.bound('showDeleteModal'))
  }

  switchOff () {
    this.unbind()
    if (this.deleteModal) this.deleteModal.hide()
  }

  remove () {
    super.remove()
    if (this.deleteModal) {
      this.deleteModal.remove()
      this.deleteModal = null
    }
  }

  showDeleteModal () {
    if (!this.deleteModal) {
      this.deleteModal = new DeleteForumModal(this.forum)
    }
    this.deleteModal.show()
  }
}
