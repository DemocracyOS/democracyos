import dom from 'component-dom';
import view from '../view/mixin';
import forumStore from '../forum-store/forum-store';
import template from './template.jade';
import roleTemplate from './role.jade';
import AddUserInput from './add-user-input/add-user-input';

const View = view('appendable', 'emptyable', 'loadable');

export default class AdminPermissions extends View {
  constructor (options = {}) {
    options.template = template;
    super(options);

    this.forum = options.forum;
    this.list = this.el.querySelector('.admin-permissions-lists');
  }

  switchOn () {
    this.reset();
  }

  reset () {
    this.loading(true);

    forumStore.getPermissions(this.forum.id)
      .then(permissions => {
        const fragment = document.createDocumentFragment();

        Object.keys(permissions).forEach(role => {
          let users = permissions[role];
          new Role({
            locals: {role, users},
            container: fragment
          });
        });

        dom(this.list).empty();
        this.list.appendChild(fragment);
        this.loading(false);
      });
  }
}

class Role extends view('appendable', 'withEvents') {
  constructor (options = {}) {
    options.template = roleTemplate;
    super(options);
    this.initAddUserInput();
  }

  initAddUserInput () {
    const container = this.el.querySelector('[data-title]');
    const input = new AddUserInput({container});
    return input;
  }
}
