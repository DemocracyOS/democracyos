import view from '../../view/mixin';
import forumStore from '../../forum-store/forum-store';
import { domRender } from '../../render/render';
import AddUserInput from '../add-user-input/add-user-input';
import template from './template.jade';
import userTemplate from './user.jade';

export default class Role extends view('appendable', 'withEvents') {
  constructor (options = {}) {
    options.template = template;
    options.locals = {role: options.role};
    super(options);

    this.onSelect = this.onSelect.bind(this);
    this.onRevoke = this.onRevoke.bind(this);
    this.list = this.el.querySelector('[data-list]');

    this.initUsers();
    this.initAddUserInput();
  }

  initUsers () {
    const fragment = document.createDocumentFragment();
    this.options.users.forEach(user => {
      if (!user) return;
      fragment.appendChild(this.renderUser(user));
    });
    this.list.appendChild(fragment);
  }

  initAddUserInput () {
    this.addUserInput = new AddUserInput({
      onSelect: this.onSelect,
      container: this.el.querySelector('[data-title]')
    });
  }

  switchOn () {
    this.bind('click', '[data-revoke]', this.onRevoke);
  }

  switchOff () {
    this.unbind('click', '[data-revoke]', this.onRevoke);
  }

  renderUser (user) {
    return domRender(userTemplate, {user});
  }

  onSelect (user) {
    const forumId = this.options.forum.id;
    const role = this.options.role;

    if (this.list.querySelector(`[data-user="${user.id}"]`)) {
      return Promise.resolve();
    }

    return new Promise((accept, reject) => {
      forumStore.grantPermission(forumId, user.id, role)
        .then(() => {
          accept();
          this.list.appendChild(this.renderUser(user));
        })
        .catch(err => {
          reject(err);
          throw err;
        });
    });
  }

  onRevoke (evt) {
    const btn = evt.target;
    const forumId = this.options.forum.id;
    const userId = btn.getAttribute('data-revoke');

    const item = this.list.querySelector(`[data-user="${userId}"]`);
    item.classList.add('revoking');

    forumStore.revokePermission(forumId, userId)
      .then(() => {
        this.list.removeChild(item);
      })
      .catch(err => {
        item.classList.remove('revoking');
        throw err;
      });
  }
}
