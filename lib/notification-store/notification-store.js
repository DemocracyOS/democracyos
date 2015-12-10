/**
 * Module Dependencies
 */

import Store from '../store/store';

class NotificationStore extends Store {
  name () {
    return 'notification';
  }
}

export default new NotificationStore;