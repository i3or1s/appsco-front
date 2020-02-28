import '@polymer/polymer/polymer-legacy.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

/**
 * @polymerBehavior
 */
export const AppscoCompanyIdpSettingsFormBehavior = {

    properties: {

        idPConfig: {
            type: Object,
            value: function() {
                return {};
            }
        },

        formPrefix: {
            type: String,
            value: ''
        }
    },

    getEncodedBodyValues: function() {
        var body = '';

        dom(this.root).querySelectorAll('[data-field]').forEach(function(item) {
            if (item.value) {
                body += body === '' ? '' : '&';
                body += encodeURIComponent(item.name) + '=' + encodeURIComponent(item.value);
            }
        }.bind(this));

        return body;
    },

    validate: function() {
        var valid = true;

        dom(this.root).querySelectorAll('[data-field]').forEach(function(item) {
            item.validate();
            valid = valid && !item.invalid;
        }.bind(this));

        return valid;
    },

    reset: function() {
        dom(this.root).querySelectorAll('[data-field]').forEach(function(item) {
            var inputContainer = item.$$('#container');

            item.value = '';
            item.invalid = false;

            // Used because gold-cc-input doesn't send 'invalid' property down to children elements
            if (inputContainer) {
                inputContainer.invalid = false;
            }
        }.bind(this));
    },

    _onKeyUp: function(event) {
        if (13 !== event.keyCode) {
            event.target.invalid = false;
        }
    }
};
