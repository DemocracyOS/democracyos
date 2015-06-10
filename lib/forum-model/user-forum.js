import Forum from './model';

class UserForum extends Forum {
  constructor () {
    super('mine');
    this.$_exists = null;
  }

  fetch () {
    let r = super.fetch();

    r.then(() => {
      this.$_exists = true;
    }).catch(err => {
      if (err && err.message && err.message === 'Forum not found') {
        this.$_exists = false;
      }
    });

    return r;
  }

  exists () {
    return this.$_exists;
  }
}

let userForum = new UserForum();

userForum.load();

window.userForum = userForum;

export default userForum;
