import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/scale-down-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import './appsco-company-idp-settings-saml-form.js';
import './appsco-company-idp-settings-openid-form.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyIdpSettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;

                --paper-dropdown-menu: {
                    display: block;
                };
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
            :host neon-animated-pages > .iron-selected {
                position: relative;
            }
        </style>

        <iron-ajax auto="" url="[[ idPIntegrationsApi ]]" headers="[[ _headers ]]" handle-as="json" on-error="_onIdPIntegrationsError" on-response="_onIdPIntegrationsResponse"></iron-ajax>

        <iron-ajax id="getDomainIdPConfig" url="[[ domain.meta.idpConfig ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onIdPConfigResponse"></iron-ajax>

        <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <paper-input id="title" label="Title" data-field="" name="[[ _formPrefix ]][title]" value="[[ _idPConfig.name ]]" required="" error-message="Please type in title." on-keyup="_onKeyUp"></paper-input>

        <paper-input id="domain" label="Domain" always-float-label="" value="[[ domain.domain ]]" disabled=""></paper-input>

        <paper-input label="Domain" data-field="" name="[[ _formPrefix ]][companyDomains][0]" value="[[ domain.self ]]" hidden=""></paper-input>

        <paper-dropdown-menu id="integrationType" label="Integration type" always-float-label\$="[[ domain.hasIdp ]]" horizontal-align="left" required="" error-message="Please select integration type." disabled\$="[[ domain.hasIdp ]]">
            <paper-listbox id="integrationList" class="dropdown-content" attr-for-selected="value" selected="[[ _idPConfig.integrationId ]]" on-iron-select="_onIntegrationTypeSelect" slot="dropdown-content">
                <template is="dom-repeat" items="[[ _integrations ]]">
                    <paper-item value="[[ item.id ]]" integration-id="[[ item.id ]]">[[ item.name ]]</paper-item>
                </template>
            </paper-listbox>
        </paper-dropdown-menu>

        <neon-animated-pages selected="[[ _activeForm ]]" attr-for-selected="name" entry-animation="scale-up-animation" exit-animation="scale-down-animation" on-neon-animation-finish="_onPageAnimationFinish">

            <appsco-company-idp-settings-saml-form name="saml" data-form="" id-p-config="[[ _idPConfig ]]" form-prefix="[[ _formPrefix ]]"></appsco-company-idp-settings-saml-form>

            <appsco-company-idp-settings-openid-form name="openid" data-form="" id-p-config="[[ _idPConfig ]]" integration="[[ _selectedIntegration ]]" form-prefix="[[ _formPrefix ]]"></appsco-company-idp-settings-openid-form>
        </neon-animated-pages>

        <paper-button id="submit" class="submit-button" on-tap="_submitForm">Save</paper-button>

        <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-company-idp-settings'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            domain: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onDomainChanged'
            },

            idPIntegrationsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _settingsApi: {
                type: String
            },

            _idPConfig: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _integrations: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _selectedIntegration: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onSelectedIntegrationChanged'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _activeForm: {
                type: String,
                value: ''
            },

            _formPrefix: {
                type: String,
                computed: '_computeFormPrefix(_activeForm)'
            }
        };
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this._clearForm();
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('show-error', this._showError.bind(this));
        this.addEventListener('hide-error', this._hideError.bind(this));
    }

    setup() {
        this.$.title.focus();
    }

    reset() {
        this._clearForm();
        this._hideError();
        this._hideLoader();
        this.shadowRoot.querySelector('[data-form]').reset();
        this.set('_idPConfig', {});
        this.set('domain', {});
        this.set('_selectedIntegration', {});
        this._activeForm = '';
    }

    setDomain(domain) {
        this.set('domain', domain);
    }

    _computeIdPIntegrationsApi(settingsApi) {
        return settingsApi ? (settingsApi + '/integrations') : null;
    }

    _computeFormPrefix(activeForm) {
        return 'openid' === activeForm ?
            'open_id_config' :
            'saml_idp_config'
            ;
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = ('string' === typeof message) ?
            message :
            ((message.detail && message.detail.message) ?
                message.detail.message :
                this.apiErrors.getError(404));
    }

    _hideError() {
        this._errorMessage = '';
    }

    _clearForm() {
        this.shadowRoot.querySelectorAll('[data-field]').forEach(function(item) {
            const inputContainer = item.querySelector('#container');

            item.value = '';
            item.invalid = false;

            // Used because gold-cc-input doesn't send 'invalid' property down to children elements
            if (inputContainer) {
                inputContainer.invalid = false;
            }
        }.bind(this));
    }

    _onDomainChanged(domain) {
        if (domain && domain.meta && domain.meta.idpConfig) {
            this.$.getDomainIdPConfig.generateRequest();
        }
    }

    _onKeyUp(event) {
        if (13 !== event.keyCode) {
            this._hideError();
            event.target.invalid = false;
        }
    }

    _onSelectedIntegrationChanged(integration) {
        for (const key in integration) {
            this._activeForm = integration.kind.toLowerCase();
            this._settingsApi = integration.meta.create;
            return false;
        }
        this._activeForm = '';
    }

    _onIntegrationTypeSelect(event) {
        const currentTarget = event.currentTarget;

        this._hideError();
        this.$.integrationType.invalid = false;

        setTimeout(function() {
            const integrationID = currentTarget.selectedItem ? currentTarget.selectedItem.integrationId : '',
                integrations = this._integrations;

            integrations.forEach(function(item) {
                if (integrationID === item.id) {
                    this.set('_selectedIntegration', item);
                    return false;
                }
            }.bind(this));
        }.bind(this), 30);
    }

    _onIdPIntegrationsError() {
        this.set('_integrations', []);
    }

    _onIdPIntegrationsResponse(event) {
        const response = event.detail.response;

        if (response && response.integrations) {
            this.set('_integrations', response.integrations);
        }
    }

    _onIdPConfigResponse(event) {
        const response = event.detail.response;

        if (response) {
            this.set('_idPConfig', {});
            this.set('_idPConfig', response[0]);
        }
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage;

        if (!this.domain.hasIdp && fromPage.$ && ('undefined' !== typeof fromPage.reset)) {
            fromPage.reset();
        }
    }

    _onEnter() {
        this._submitForm();
    }

    _validateForm() {
        let valid = true;

        this.shadowRoot.querySelectorAll('[data-field]').forEach(function(item) {
            item.validate();
            valid = valid && !item.invalid;
        }.bind());

        return valid;
    }

    _getEncodedBodyValues(form) {
        let body = '';

        this.shadowRoot.querySelectorAll('[data-field]').forEach(function(item) {
            if (item.value) {
                body += ('' === body) ? '' : '&';
                body += encodeURIComponent(item.name) + '=' + encodeURIComponent(item.value);
            }
        }.bind(this));

        body += ('' === body) ? '' : '&';
        body += form.getEncodedBodyValues();

        return body;
    }

    _submitForm() {
        if (!this._activeForm) {
            this.$.integrationType.invalid = true;
            return false;
        }

        const form = this.shadowRoot.querySelector('[name="' + this._activeForm + '"]');

        if (this._validateForm() && form.validate()) {
            if (form.getCertificates) {
                const certificates = form.getCertificates();

                if (!certificates || 0 === certificates.length) {
                    this._showError('Please add at least one certificate.');
                    return;
                }
            }

            this._showLoader();

            this._save(form).then(function(response) {
                const config = response[0];

                this.domain.hasIdp = true;
                this.domain.meta.idpConfig = config.self;

                this.dispatchEvent(new CustomEvent('idp-settings-saved', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        domain: this.domain,
                        idPConfig: config
                    }
                }));

                this._hideLoader();
            }.bind(this), function(code) {
                this._showError(this.apiErrors.getError(code));
                this._hideLoader();
            }.bind(this));
        }
    }

    _save(form) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: this._settingsApi,
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers,
                    body: this._getEncodedBodyValues(form)
                };

            if (this.domain.hasIdp) {
                options.url = this.domain.meta.idpConfig;
                options.method = 'PUT';
            }
            else {
                options.body += ('&' + this._formPrefix +'[integrationId]=' + encodeURIComponent(this.$.integrationList.selectedItem.value));
            }

            request.send(options).then(function() {
                if (200 === request.status) {
                    resolve(request.response);
                }
            }.bind(this), function() {
                reject(request.response.code);
            }.bind(this));
        }.bind(this));
    }
}
window.customElements.define(AppscoCompanyIdpSettings.is, AppscoCompanyIdpSettings);
