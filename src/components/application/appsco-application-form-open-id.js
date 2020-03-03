import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationFormOpenId extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            paper-dropdown-menu {
              display: block;
            }
            paper-toggle-button {
              margin-top: 20px;
            }
            paper-toggle-button[disabled] {
              --paper-toggle-button-label-color: var(--secondary-text-color);
            }
        </style>
        <paper-input id="issuer" data-field="" label="Issuer" value="[[ claims.issuer ]]" name\$="[[ claimsNamePrefix ]][issuer]" error-message="Please enter issuer"></paper-input>

        <paper-input id="redirectUri" data-field="" label="Redirect URI" value="[[ claims.redirectUri ]]" name\$="[[ claimsNamePrefix ]][redirectUri]" error-message="Please enter redirect URI"></paper-input>

        <paper-input id="clientSecret" data-field="" label="Client secret" value="[[ claims.clientSecret ]]" name\$="[[ claimsNamePrefix ]][clientSecret]" error-message="Please enter client secret"></paper-input>

        <iron-a11y-keys keys="enter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-application-form-open-id'; }

    static get properties() {
        return {
            claims: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            claimsNamePrefix: {
                type: String,
                value: "claims_open_id"
            }
        };
    }
}
window.customElements.define(AppscoApplicationFormOpenId.is, AppscoApplicationFormOpenId);
