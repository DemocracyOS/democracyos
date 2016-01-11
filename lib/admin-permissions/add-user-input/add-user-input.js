import view from '../../view/mixin';
import userStore from '../../user-store/user-store';
import template from './template.jade';
import { DropdownInput as Dropdown } from './dropdown/dropdown';

export default class AddUserInput extends view('appendable') {
  constructor (options = {}) {
    options.template = template;
    super(options);
  }

  switchOn() {
    const input = this.el.querySelector('[data-input]');
    const dropdown = new Dropdown({
      container: this.el,
      input: input,
      onSelect: function (data) {
        console.log(data);
      }
    });

    userStore.search('matias')
      .then(users => {
        console.log(users);
      })
      .catch(err => {
        throw err;
      });

    dropdown
      .add({text: 'sarasa'})
      .add({text: 'sarasa2'})
      .add({text: 'sarasa3'})
      .add({text: 'sarasa4'});
  }
}
