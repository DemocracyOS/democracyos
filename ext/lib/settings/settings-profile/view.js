import React from 'react'
import { render as ReactRender } from 'react-dom'
import debug from 'debug'
import t from 't-component'
import user from 'lib/user/user.js'
import FormView from 'lib/form-view/form-view'
import config from 'lib/config/config'
import template from './template.jade'
import CompleteProfileRegistry from './complete-profile-registry/component'

let log = debug('democracyos:settings-profile')

export default class ProfileForm extends FormView {
    /**
     * Creates a profile edit view
     */

    constructor() {
        super(template)
        
    }
    // const userExtra = Object.keys(user.extra)
    /**
     * Turn on event bindings
     */

    switchOn() {
        this.on('success', this.bound('onsuccess'))
        this.locales = this.find('select#locale')[0]

        config.availableLocales.forEach((locale) => {
            var option = document.createElement('option')
            option.value = locale
            option.innerHTML = t(`settings.locale.${locale}`)
            this.locales.appendChild(option)
        })

        this.locales.value = user.locale || config.locale
        var selected = this.find(`option[value="${this.locales.value}"]`)
        selected.attr('selected', true)
        if (Object.keys(user.extra).length > 0) {
            ReactRender(
            (<CompleteProfileRegistry
                forum={this.forum} />),
                this.el[0].querySelector('.complete-profile-registry'))
        }
    }

    /**
     * Turn off event bindings
     */

    switchOff() {
        this.off()
    }

    /**
     * Handle `error` event with
     * logging and display
     *
     * @param {String} error
     * @api private
     */

    onsuccess() {
        log('Profile updated')
        user.load('me')

        user.once('loaded', () => {
            this.find('img').attr('src', user.profilePicture())
            this.messages([t('settings.successfuly-updated')], 'success')

            if (user.locale && user.locale !== config.locale) {
                setTimeout(function () {
                    window.location.reload()
                }, 10)
            }
        })
    }

    /**
     * Sanitizes form input data. This function has side effect on parameter data.
     * @param  {Object} data
     */

    postserialize(data) {
        data.firstName = data.firstName.trim().replace(/\s+/g, ' ')
        data.lastName = data.lastName.trim().replace(/\s+/g, ' ')
    }
}
