import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import './appsco-account-orgunit-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountOrgunits extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-account-orgunits;
            }
            :host .orgunits {
                @apply --layout-vertical;
                @apply --appsco-orgunits;
            }
            :host appsco-account-orgunit-item:first-of-type {
                border-top: none;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
        </style>

        <div class="orgunits">
            <template is="dom-repeat" items="[[ account.account.org_units ]]" rendered-item-count="{{ renderedCount }}">
                <appsco-account-orgunit-item item="[[ item ]]" account="[[ account ]]"></appsco-account-orgunit-item>
            </template>
        </div>

        <template is="dom-if" if="{{ !renderedCount }}">
            <p class="message">
                Account doesn't belong to any organization unit.
            </p>
        </template>
`;
    }

    static get is() { return 'appsco-account-orgunits'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                }
            }
        };
    }
}
window.customElements.define(AppscoAccountOrgunits.is, AppscoAccountOrgunits);
