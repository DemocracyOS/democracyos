import bus from 'bus';
import Store from '../store/store';

class ForumStore extends Store {
  constructor () {
    super();
    this._userForumName = null;

    bus.on('logout', this.unloadUserForum.bind(this));
  }

  name () {
    return 'forum';
  }

  parse (forum) {
    forum.url = '/' + forum.name;
    return Promise.resolve(forum);
  }

  findUserForum () {
    let name = this._userForumName;
    if (this.item.get(name)) return Promise.resolve(this.item.get(name));

    let url = this.url('mine');
    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = this._fetch(url);

    fetch
      .then(item => {
        this._userForumName = item.name;
        this.item.set(item.name, item);
        this.busEmit(`update:${item.name}`, item);
        this.busEmit(`update:mine`, item);
        return item;
      })
      .catch(err => {
        if (404 === err.status) return;
        if (403 === err.status) return;
        throw err;
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
