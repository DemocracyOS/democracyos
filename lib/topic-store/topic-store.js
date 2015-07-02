import bus from 'bus';
import Store from '../store/store';

class TopicStore extends Store {

  constructor(forumName) {
    super();
    this.setForum(forumName);
  }

  name () {
    return 'topic-store';
  }

  url(path = 'all') {
    return `/api/topic/${path}?forum=${this.forumName}`;
  }

  parse (topic) {
    topic.url = '/' + topic.id;
    return topic;
  }

  setForum(forumName) {
    this.forumName = forumName;
    this.allItems = null;
  }
}

const topicStore = new TopicStore();

export default topicStore;
