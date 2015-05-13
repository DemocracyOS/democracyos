import debug from 'debug';
import t from 't-component';
import citizen from '../citizen/citizen.js';
import FormView from '../form-view/form-view.js';
import template from './template.jade';
import l10n from '../l10n/l10n.js';

let log = debug('democracyos:settings-profile');

export default class ProfileForm extends FormView {

  /**
   * Creates a profile edit view
   */

  constructor () {
    super(template);
  }

  /**
   * Turn on event bindings
   */

  switchOn () {
    this.on('success', this.bound('onsuccess'));
    this.locales = this.find('select#locale')[0];
    l10n.supported.forEach((language) => {
      var option = document.createElement('option');
      option.value = language;
      option.innerHTML = t(language);
      this.locales.appendChild(option);
    });

    this.locales.value = citizen.locale || 'en';
  }

  /**
   * Turn off event bindings
   */

  switchOff () {
    this.off();
  }

  /**
   * Handle `error` event with
   * logging and display
   *
   * @param {String} error
   * @api private
   */

  onsuccess () {
    log('Profile updated');
    citizen.load('me');

    citizen.once('loaded', () => {
      this.find('img').attr('src', citizen.profilePicture());
      this.messages([t('settings.successfuly-updated')], 'success');

      if (citizen.locale !== config.locale) {
        setTimeout(function(){
          window.location.reload();
        }, 10);
      }
    });
  }

  /**
   * Sanitizes form input data. This function has side effect on parameter data.
   * @param  {Object} data
   */

  postserialize (data) {
    data.firstName = data.firstName.trim().replace(/\s+/g, ' ');
    data.lastName = data.lastName.trim().replace(/\s+/g, ' ');
  }
}
