import bus from 'bus';
import Store from '../store/store';

class ForumStore extends Store {

  constructor () {
    super();
    this._userForumName = null;

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
    let name = this._userForumName;
    if (name && this.items.get(name)) return Promise.resolve(this.items.get(name));

    if (this._fetches.get('mine')) return this._fetches.get('mine');

    let fetch = this._fetch('mine');

    fetch
      .then(item => {
        this._userForumName = item.name;
        this.items.set(item.name, item);
        bus.emit(`${this.name()}:update:${item.name}`, item);
      })
      .catch(err => {
        if (404 === err.status) return;
        this.log('Found error', err);
      });

    return fetch;
  }

  unloadUserForum () {
    return this.unload(this._userForumName);
  }

  destroyUserForum () {
    return this.destroy(this._userForumName);
  }
}

const forumStore = new ForumStore();

export default forumStore;
