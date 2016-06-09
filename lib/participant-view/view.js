import tip from 'democracyos-tip'
import View from '../view/view.js'
import template from './template.jade'

export default class Participant extends View {

  /**
   * Participants View Class
   *
   * @param {Array} participants array of ids
   * @api public
   */

  constructor (participant, index) {
    super(template, { participant: participant, index: index })
    this.participant = participant
    this.index = index
  }

  switchOn () {
    tip(this.el[0])
  }
}
