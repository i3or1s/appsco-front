import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { AppscoCompanyIdpSettingsFormBehavior } from './appsco-company-idp-settings-form-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyIdpSettingsOpenidForm extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoCompanyIdpSettingsFormBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
        </style>

        <template is="dom-if" if="[[_needsSubDomain]]">
            <paper-input label="Subdomain" data-field="" name="[[ formPrefix ]][company]" value="[[ idPConfig.company ]]" required="" error-message="Please type in subdomain." on-keyup="_onKeyUp">

                <template is="dom-if" if="[[ _subdomain ]]">
                    <div suffix="" slot="suffix">[[ _subdomain ]]</div>
                </template>
            </paper-input>
        </template>

        <template is="dom-if" if="[[_needsClientId]]">
            <paper-input label="Client ID" data-field="" name="[[ formPrefix ]][client_id]" value="[[ idPConfig.client_id ]]" required="" error-message="Please type in client ID." on-keyup="_onKeyUp"></paper-input>
        </template>

        <template is="dom-if" if="[[_needsClientSecret]]">
            <paper-input label="Client Secret" data-field="" name="[[ formPrefix ]][client_secret]" value="[[ idPConfig.client_secret ]]" required="" error-message="Please type in client secret." on-keyup="_onKeyUp"></paper-input>
        </template>

        <template is="dom-if" if="[[_needsAuthUrl]]">
            <paper-input label="Authentication url" data-field="" name="[[ formPrefix ]][authentication_url]" value="[[ idPConfig.authentication_url ]]" required="" error-message="Please type in authentication url." on-keyup="_onKeyUp">
            </paper-input>
        </template>

        <template is="dom-if" if="[[_needsUserInfoUrl]]">
            <paper-input label="User info url" data-field="" name="[[ formPrefix ]][user_info_url]" value="[[ idPConfig.user_info_url ]]" required="" error-message="Please type in user info url." on-keyup="_onKeyUp">
            </paper-input>
        </template>

        <template is="dom-if" if="[[_needsTokenUrl]]">
            <paper-input label="Token url" data-field="" name="[[ formPrefix ]][token_url]" value="[[ idPConfig.token_url]]" required="" error-message="Please type in token url." on-keyup="_onKeyUp">
            </paper-input>
        </template>

        <template is="dom-if" if="[[_needsScope]]">
            <paper-input label="Scope" data-field="" name="[[ formPrefix ]][scope]" value="[[ idPConfig.scope]]" required="" error-message="Please type in scope." on-keyup="_onKeyUp">
            </paper-input>
        </template>
`;
    }

    static get is() { return 'appsco-company-idp-settings-openid-form'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onIntegrationChanged'
            },

            _subdomain: {
                type: String,
                value: ''
            },

            _needsSubDomain: {
                type: Boolean,
                computed: '_computeNeedsSubDomain(integration)'
            },

            _needsClientId: {
                type: Boolean,
                computed: '_computeNeedsClientId(integration)'
            },

            _needsClientSecret: {
                type: Boolean,
                computed: '_computeNeedsClientSecret(integration)'
            },

            _needsAuthUrl: {
                type: Boolean,
                computed: '_computeNeedsAuthUrl(integration)'
            },

            _needsUserInfoUrl: {
                type: Boolean,
                computed: '_computeNeedsUserInfoUrl(integration)'
            },

            _needsTokenUrl: {
                type: Boolean,
                computed: '_computeNeedsTokenUrl(integration)'
            },

            _needsScope: {
                type: Boolean,
                computed: '_computeNeedsScope(integration)'
            }
        };
    }

    _computeNeedsSubDomain(integration) {
        return integration.id === 'bamboo_hr';
    }

    _computeNeedsClientId(integration) {
        return integration.id === 'generic_open_id';
    }

    _computeNeedsClientSecret(integration) {
        return integration.id === 'generic_open_id';
    }

    _computeNeedsAuthUrl(integration) {
        return integration.id === 'generic_open_id';
    }

    _computeNeedsUserInfoUrl(integration) {
        return integration.id === 'generic_open_id';
    }

    _computeNeedsTokenUrl(integration) {
        return integration.id === 'generic_open_id';
    }

    _computeNeedsScope(integration) {
        return integration.id === 'generic_open_id';
    }

    _onIntegrationChanged(integration) {
        this._subdomain = 'bamboo_hr' === integration.id ?
            '.bamboohr.com' :
            ''
        ;
    }
}
window.customElements.define(AppscoCompanyIdpSettingsOpenidForm.is, AppscoCompanyIdpSettingsOpenidForm);
