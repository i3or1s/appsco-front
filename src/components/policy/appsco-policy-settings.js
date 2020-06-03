import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import './appsco-ip-whitelist-policy-settings.js';
import './appsco-enforce-two-factor-policy-settings.js';
import './appsco-enforce-duo-security-policy-settings.js';
import './appsco-login-time-restriction-policy-settings.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPolicySettings extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                padding: 4px;
                @apply --appsco-policy-settings;
            }
            :host .info {
                @apply --info-message;
            }
        </style>

        <template is="dom-if" if="[[ !_customSettings ]]">
            <p class="info">There are no additional settings for this policy.</p>
        </template>

        <template is="dom-if" if="[[ _ipWhitelistPolicyActive ]]">
            <appsco-ip-whitelist-policy-settings policy="[[ policy ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-ip-whitelist-policy-settings>
        </template>

        <template is="dom-if" if="[[ _enforceTwoFactoryPolicyActive ]]">
            <appsco-enforce-two-factor-policy-settings policy="[[ policy ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-enforce-two-factor-policy-settings>
        </template>

        <template is="dom-if" if="[[ _enforceDuoSecurityPolicyActive ]]">
            <appsco-enforce-duo-security-policy-settings policy="[[ policy ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-enforce-duo-security-policy-settings>
        </template>

        <template is="dom-if" if="[[ _loginTimeRestrictionPolicyActive ]]">
            <appsco-login-time-restriction-policy-settings policy="[[ policy ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-login-time-restriction-policy-settings>
        </template>
`;
    }

    static get is() { return 'appsco-policy-settings'; }

    static get properties() {
        return {
            policy: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _ipWhitelistPolicyActive: {
                type: Boolean,
                computed: '_computeIpWhitelistPolicyActive(policy)'
            },

            _enforceTwoFactoryPolicyActive: {
                type: Boolean,
                computed: '_computeEnforceTwoFactoryPolicyActive(policy)'
            },

            _enforceDuoSecurityPolicyActive: {
                type: Boolean,
                computed: '_computeEnforceDuoSecurityPolicyActive(policy)'
            },

            _loginTimeRestrictionPolicyActive: {
                type: Boolean,
                computed: '_computeLoginTimeRestrictionPolicyActive(policy)'
            },

            _customSettings: {
                type: Boolean,
                computed: '_computeHasCustomSettings(_ipWhitelistPolicyActive, _enforceTwoFactoryPolicyActive, _enforceDuoSecurityPolicyActive, _loginTimeRestrictionPolicyActive)'
            }
        };
    }

    _computeIpWhitelistPolicyActive(policy) {
        return (policy.name && 'ip whitelist' === policy.name.toLowerCase());
    }

    _computeEnforceTwoFactoryPolicyActive(policy) {
        return (policy.name && 'enforce two-factor' === policy.name.toLowerCase());
    }

    _computeEnforceDuoSecurityPolicyActive(policy) {
        return (policy.name && 'enforce duo security' === policy.name.toLowerCase());
    }

    _computeLoginTimeRestrictionPolicyActive(policy) {
        return (policy.name && 'login time restriction' === policy.name.toLowerCase());
    }

    _computeHasCustomSettings(..._check) {
        return _check.reduce((result, start) => {
            return result || start;
        }, false);
    }
}
window.customElements.define(AppscoPolicySettings.is, AppscoPolicySettings);
