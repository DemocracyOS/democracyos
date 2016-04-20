import View from '../view/view.js';
import template from './template.jade';

export default class ProposalClauses extends View {
  constructor (topic) {
    super(template, { clauses: topic.clauses });
    this.topic = topic;
  }
}
