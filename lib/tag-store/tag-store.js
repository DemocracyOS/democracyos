import Store from '../store/store';

class TagStore extends Store {
  constructor () {
    super();
  }

  name () {
    return 'tag';
  }
}

const tagStore = new TagStore();

export default tagStore;
