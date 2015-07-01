import bus from 'bus';
import Store from '../store/store';

class TopicStore extends Store {

  constructor(forum) {
    super();
    this.setForum(forum);
  }

  name () {
    return 'topic-store';
  }

  url(path = 'all') {
    const forum = this.forum ? `forum=${this.forum}` : ''
    return `/api/topic/${path}?${forum}`;
  }

  parse (topic) {
    topic.url = '/' + topic.id;
    return topic;
  }

  setForum(forum) {
    this.forum = forum;
    this.allItems = null;
  }
}

const topicStore = new TopicStore();

export default topicStore;
