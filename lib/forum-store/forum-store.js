import bus from 'bus';
import Store from '../store/store';

class ForumStore extends Store {

  constructor () {
    super();
    bus.on('logout', this.unloadUserForum.bind(this));
  }

  name () {
    return 'forum-store';
  }

  url (id) {
    return `/api/forum/${id}`;
  }

  parse (forum) {
    forum.url = '/' + forum.name;
    return forum;
  }

  getUserForum () {
    return this.get('mine');
  }

  unloadUserForum () {
    return this.unload('mine');
  }

  destroyUserForum () {
    return this.destroy('mine');
  }
}

const forumStore = new ForumStore();

export default forumStore;
