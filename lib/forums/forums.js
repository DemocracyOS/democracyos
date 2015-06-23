import RemoteModel from './remote-model';
import Log from 'debug';

const log = new Log('democracyos:forums');

class Forums extends RemoteModel {

  constructor () {
    super();
    this.loadFromParamsMiddleware = this.loadFromParamsMiddleware.bind(this);
  }

  name () {
    return 'forums';
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

  deleteUserForum () {
    return this.delete('mine');
  }

  loadFromParamsMiddleware (ctx, next) {
    const name = ctx.params.forum;

    this.get(name)
      .then(function(forum){
        ctx.forum = forum;
        next();
      })
      .catch(function(err){
        log('Found error %s', err);
      });
  }
}

const forums = new Forums();

export default forums;
