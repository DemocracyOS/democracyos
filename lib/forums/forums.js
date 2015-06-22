import Collection from './collection';

class Forums extends Collection {

  name () {
    return 'forums';
  }

  url (id) {
    return `/api/forum/${id}`;
  }

  getUserForum () {
    return this.get('mine');
  }

  unloadUserForum () {
    return this.unload('mine');
  }

}

const forums = new Forums();

export default forums;
