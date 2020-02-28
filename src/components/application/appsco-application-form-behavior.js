import '@polymer/polymer/polymer-legacy.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

/**
 *
 * @type {{properties: {claims: {type: Object, value: Polymer.AppscoApplicationFormBehavior.properties.claims.value}}, isValid: Polymer.AppscoApplicationFormBehavior.isValid, encodedBodyValues: Polymer.AppscoApplicationFormBehavior.encodedBodyValues, didFieldsChanged: Polymer.AppscoApplicationFormBehavior.didFieldsChanged, reset: Polymer.AppscoApplicationFormBehavior.reset}}
 * @polymerBehavior
 */
export const AppscoApplicationFormBehavior = {

    properties: {
        claims: {
            type: Object,
            value: function () { return {}; }
        }
    },

    isValid: function() {
        let valid = true;
        dom(this.root).querySelectorAll('[data-field]').forEach(function(item, key) {
            item.validate();
            valid = valid && !item.invalid;
        }.bind(this));

        return valid;
    },

    encodedBodyValues: function () {
        let body = '';

        dom(this.root).querySelectorAll('[data-field]').forEach(function(item, key) {
            if ('choice' === item.getAttribute('data-field') && item.selectedItem) {
                const value = item.selectedItem.value;
                body += body === '' ? '' : '&';
                body += encodeURIComponent(item.getAttribute('name')) + '=' + encodeURIComponent(value)
            }
            else if (item.value) {
                body += body === '' ? '' : '&';
                body += encodeURIComponent(item.getAttribute('name')) + '=' + encodeURIComponent(item.value)
            }
        }.bind(this));

        return body;
    },

    didFieldsChanged: function() {
        let fieldChanged = false;

        for (let prop in this.claims) {
            dom(this.root).querySelectorAll('[data-field]').forEach(function(item, key) {
                const value = ('choice' === item.getAttribute('data-field')) ?
                    (item.selectedItem ? item.selectedItem.value : '') : item.value;

                fieldChanged = fieldChanged || this.claims[item.getAttribute('id')] !== value;
            }.bind(this));

            return fieldChanged;
        }

        dom(this.root).querySelectorAll('[data-field]').forEach(function(item, key) {
            const value = ('choice' === item.getAttribute('data-field')) ?
                (item.selectedItem ? item.selectedItem.value : '') : item.value;

            fieldChanged = fieldChanged || value;
        }.bind(this));

        return fieldChanged;
    },

    reset: function() {
        dom(this.root).querySelectorAll('[data-field]').forEach(function(item, key) {
            const inputContainer = item.$$('#container');

            item.value = this.claims[item.getAttribute('id')] ? this.claims[item.getAttribute('id')] : '';
            item.invalid = false;

            // Used because gold-cc-input doesn't send 'invalid' property down to children elements
            if (inputContainer) {
                inputContainer.invalid = false;
            }
        }.bind(this));
    }
};
