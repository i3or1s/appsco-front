import '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDateFormat extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
            }
        </style>
        [[ dateFormatted ]]
`;
    }

    static get is() { return 'appsco-date-format'; }

    static get properties() {
        return {
            date: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            options: {
                type: Object,
                value: function () {
                    return {year: "numeric", month: "short", day: "numeric"};
                }
            },

            dateFormatted: {
                type: String,
                computed: '_dateFormat(date, options)'
            }
        };
    }

    /**
     * Formats date and returns formatted date as string.
     *
     * @returns {string}
     * @private
     */
    _dateFormat(value, options) {
        if (value) {
            return (new Date(value)).toLocaleDateString('en', options);
        }
    }
}
window.customElements.define(AppscoDateFormat.is, AppscoDateFormat);
