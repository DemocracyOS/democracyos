/**
 * Module dependencies.
 */

import o from 'dom';
import template from './card-template.jade';
import View from '../view/view';
import trim from 'trim-html';

export default class FeedCard extends View {
  
  constructor(feed) {
    super();
    this.feed = feed;
    this.parse();
    super(template, { feed } );
  }
  
  /**
   * Parse embedded images
   */

  parse() {
    var type = this.feed.type;
    this.feed.paragraphs = [];

    if ((type == 'topic-published' || type == 'topic-voted') && this.feed.topic.summary) {
      var summary = o(this.feed.topic.summary);
      var image = o('img', summary);
      if (image.length) {
        this.feed.image = image.first().attr('src');
      }
      o('br', summary).remove();
      o('img', summary).remove();
      var paragraphs = o('div', summary);
      if (!paragraphs.length) paragraphs = summary;

      function notempty(text) {
        return text;
      }

      function getText(el) {
        var el = o(el);
        el.find('*').style(null);
        return el.html();
      }

      function wrapWithP(el) {
        return '<p>' + el + '</p>';
      }

      paragraphs = paragraphs.map(getText).toArray().filter(notempty).map(wrapWithP).join('');

      this.feed.paragraphs = trim(paragraphs, { limit: 450 });
    }
  }
}
