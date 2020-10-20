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

class AppscoApplicationFormAuroraFiles extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
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
        <paper-input id="email" data-field="" label="Email" value="[[ claims.email ]]" name\$="[[ claimsNamePrefix ]][email]" error-message="Please enter email"></paper-input>

        <paper-input id="login" data-field="" label="Login" value="[[ claims.login ]]" name\$="[[ claimsNamePrefix ]][login]" error-message="Please enter login"></paper-input>

        <paper-input id="password" data-field="" label="Password" value="[[ claims.password ]]" name\$="[[ claimsNamePrefix ]][password]" error-message="Please enter password"></paper-input>

        <iron-a11y-keys keys="enter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-application-form-aurora-files'; }

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
                value: "claims_aurora_files"
            }
        };
    }
}
window.customElements.define(AppscoApplicationFormAuroraFiles.is, AppscoApplicationFormAuroraFiles);
