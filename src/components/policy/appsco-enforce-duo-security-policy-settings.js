import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-ajax/iron-request.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoEnforceDuoSecurityPolicySettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host .info {
                @apply --info-message;
                margin-bottom: 0;
            }
            :host .save-action {
                @apply --primary-button;
                width: 60px;
                padding: 4px 8px;
                margin-top: 10px;
            }
            :host ol {
                padding-left:16px;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="form">
            <p class="info">
                <span>Steps to preform on Duo account</span>
                <ol>
                    <li>Log in to the Duo Admin Panel and navigate to Applications.</li>                
                    <li>Click Protect an Application and locate the entry for Web SDK in the applications list.</li>                
                    <li>Click Protect to the far-right to configure the application and get your integration key, secret key, and API hostname.</li>                
                    <li>Information that is provided to you by Duo should be entered in the fields below.</li>                
                </ol>
            </p>

            <paper-input id="ipIntegrationKey" label="Integration Key" name="policy[integrationKey]" value="{{ policy.integrationKey }}" on-keyup="_onKeyUp"></paper-input>
            <paper-input id="ipSecretKey" label="Secret Key" name="policy[secretKey]" value="{{ policy.secretKey }}" on-keyup="_onKeyUp"></paper-input>
            <paper-input id="ipApiHostname" label="API Hostname" name="policy[apiHostname]" value="{{ policy.apiHostname }}" on-keyup="_onKeyUp"></paper-input>

            <paper-button type="button" class="save-action" on-tap="_onSaveAction">Save</paper-button>
        </div>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-enforce-duo-security-policy-settings'; }

    static get properties() {
        return {
            policy: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _target: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();
        this._target = this;
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _onKeyUp(event) {
        if (13 !== event.keyCode) {
            this._hideError();
        }
    }

    _onEnterAction(event) {
        event.stopPropagation();
        this._onSaveAction();
    }

    _onSaveAction() {
        if (!this._isValid()) {
            this._showError("Some of the input fields might be empty. Please fill them up.")
            return;
        }
        this._updatePolicy();
    }

    _isValid() {
        return this.policy.integrationKey !== '' &&
            this.policy.secretKey !== '' &&
            this.policy.apiHostname !== ''
            ;
    }

    _updatePolicy() {
        const policy = this.policy;

        const request = document.createElement('iron-request'),
            options = {
                url: policy.self,
                method: 'PUT',
                headers: this._headers,
                handleAs: 'json'
            };
        let body = 'policy[name]=' + policy.name + '&policy[description]=' + policy.description;
        body += '&policy[integrationKey]=' + encodeURIComponent(policy.integrationKey);
        body += '&policy[secretKey]=' + encodeURIComponent(policy.secretKey);
        body += '&policy[apiHostname]=' + encodeURIComponent(policy.apiHostname);
        options.body = body;

        this._showLoader();

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('policy-updated', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        policy: request.response
                    }
                }));

                this._hideLoader();
            }
        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }
}
window.customElements.define(AppscoEnforceDuoSecurityPolicySettings.is, AppscoEnforceDuoSecurityPolicySettings);
