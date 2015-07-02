import Store from '../store/store';

class TopicStore extends Store {

  constructor () {
    super();
  }

  name () {
    return 'topic';
  }

  url (id, forumName) {
    if (!forumName) return super.url(id);
    return `${super.url(id)}?forum=${forumName}`;
  }

  parse (topic) {
    topic.url = '/' + topic.id;
    return topic;
  }

}

const topicStore = new TopicStore();

export default topicStore;
