import bus from 'bus';
import Store from '../store/store';
import Log from 'debug';

const log = new Log('democracyos:forum-store');

class ForumStore extends Store {

  constructor () {
    super();
    this.getFromParamsMiddleware = this.getFromParamsMiddleware.bind(this);
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

  /**
   * Get the Forum of the current user
   *
   * @return {Promise} fetch
   * @api public
   */
  getUserForum () {
    return this.get('mine');
  }

  unloadUserForum () {
    return this.unload('mine');
  }

  destroyUserForum () {
    return this.destroy('mine');
  }

  /**
   * Middleware to load forum from current page url, gets it from '/:forum'.
   *
   * @return {Middleware}
   * @api public
   */
  getFromParamsMiddleware (ctx, next) {
    const name = ctx.params.forum;

    this.get(name)
      .then(forum => {
        ctx.forum = forum;
        next();
      })
      .catch(err => log('Found error %s', err));
  }
}

const forumStore = new ForumStore();

export default forumStore;
