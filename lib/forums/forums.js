import Collection from './collection';

class Forums extends Collection {

  name () {
    return 'forums';
  }

  url (id) {
    return `/api/forum/${id}`;
  }

}

const forums = new Forums();

export default forums;
