import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountRoles extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                @apply --appsco-account-roles;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
            .info {
                margin-top: 10px;
            }
            .info p {
                margin-top: 5px;
                margin-bottom: 0;
            }
        </style>

        <paper-toggle-button id="administratorSwitch" checked\$="[[ _admin ]]" on-change="_onAdministratorSwitch">Company administrator</paper-toggle-button>

        <div class="info">
            <template is="dom-if" if="[[ _admin ]]">
                <p>The account has administrator role within the company.</p>
                <p>He is allowed to manage resources, other accounts and settings of the company.</p>
            </template>

            <template is="dom-if" if="[[ !_admin ]]">
                <p>Give the account administrator role within the company.</p>
                <p>He will be allowed to manage resources, other accounts and settings of the company.</p>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-account-roles'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _admin: {
                type: Boolean,
                computed: '_computeAdminState(account)'
            }
        };
    }

    _computeAdminState(account) {
        return (account.roles && account.roles.indexOf('COMPANY_ROLE_ADMIN') !== -1);
    }

    _onAdministratorSwitch() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.account.self + '/admin',
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };

        this.$.administratorSwitch.disabled = true;

        request.send(options).then(function() {
            const account = request.response;

            this.set('account', account);
            this.$.administratorSwitch.disabled = false;

            this.dispatchEvent(new CustomEvent('account-role-changed', {
                bubbles: true,
                composed: true,
                detail: {
                    account: account,
                    role: {
                        name: 'Administrator',
                        value: this._computeAdminState(account)
                    }
                }
            }));
        }.bind(this));
    }
}
window.customElements.define(AppscoAccountRoles.is, AppscoAccountRoles);
