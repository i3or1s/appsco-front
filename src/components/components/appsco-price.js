import '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPrice extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
            }
        </style>
        [[ priceFormatted ]]
`;
    }

    static get is() { return 'appsco-price'; }

    static get properties() {
        return {
            price: {
                type: Number
            },

            currency: {
                type: String
            },

            priceFormatted: {
                type: String,
                computed: '_priceFormat(price, currency)'
            }
        };
    }

    /**
     * Formats price and currency
     *
     * @returns {string}
     * @private
     */
    _priceFormat(price, currrency) {
        if (price) {
            return (price/100).toFixed(2) + " " + currrency;
        }

        return "";
    }
}
window.customElements.define(AppscoPrice.is, AppscoPrice);
