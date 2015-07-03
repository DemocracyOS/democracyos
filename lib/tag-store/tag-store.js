import Store from '../store/store';

class TagStore extends Store {

  constructor () {
    super();
  }

  name () {
    return 'tag';
  }

  url (path) {
    return `${super.url(path)}`;
  }

  parse (tag) {
    tag.url = '/' + tag.id;
    return tag;
  }

}

const tagStore = new TagStore();

export default tagStore;
