import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-down-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-form-error.js';
import '../appsco-application-form-item.js';
import '../appsco-application-form-rdp.js';
import '../appsco-application-form-unpw.js';
import '../appsco-application-form-cc.js';
import '../appsco-application-form-login.js';
import '../appsco-application-form-passport.js';
import '../appsco-application-form-securenote.js';
import '../appsco-application-form-softwarelicence.js';
import '../appsco-application-form-saml.js';
import '../appsco-application-form-saml-dropbox.js';
import '../appsco-application-form-saml-office-365.js';
import '../appsco-application-form-open-id.js';
import '../appsco-application-form-aurora-files.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyResourceSettings extends mixinBehaviors([
    Appsco.HeadersMixin,
    NeonAnimationRunnerBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host .claims-container {
                margin-top: 20px;
            }
            paper-dropdown-menu {
                width: 100%;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
            :host .info {
                margin-top: 10px;
            }
            :host p {
                margin-top: 4px;
                margin-bottom: 4px;
            }
            :host .claims-form {
                display: none;
                margin-top: 10px;
            }
            :host .info {
                @apply --info-message;
                margin-top: 20px;
            }
            :host .user-can-edit-toggle {
                margin-top: 10px;
            }
            :host .save-action {
                margin: 10px 0 0 0;
                @apply --form-action;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="configuration-container">
            <iron-form id="saveResourceConfigurationForm" headers="[[ _headers ]]" on-iron-form-presubmit="_onConfigurationFormPresubmit" on-iron-form-error="_onConfigurationFormError" on-iron-form-response="_onConfigurationFormResponse">
                <form method="POST" action="[[ _updateConfigurationAction ]]">

                    <paper-input id="title" label="Title" name="configure_application[title]" value="[[ resource.title ]]" required="" auto-validate="" error-message="Please enter resource title."></paper-input>

                    <template is="dom-if" if="[[ _configureUrlPermission ]]">
                        <paper-input id="url" label="Url" name="configure_application[url]" value="[[ resource.url ]]" pattern="[[ _urlValidationPattern ]]" required="" auto-validate="" error-message="Please enter a valid url."></paper-input>
                    </template>

                    <paper-dropdown-menu id="provisioningSupport" label="Provisioning support" name="configure_application[provisioning]" horizontal-align="left">
                        <paper-listbox id="provisioningSupportList" class="dropdown-content" attr-for-selected="value" selected="[[ _preselectedProvisioningSupport ]]" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _provisioningSupportList ]]">
                                <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                            </template>

                        </paper-listbox>
                    </paper-dropdown-menu>
                </form>
            </iron-form>
        </div>

        <div class="claims-container">
            <template is="dom-if" if="[[ _claimTypeSwitchPermission ]]">
                <paper-toggle-button checked\$="[[ _claimTypeIndividual ]]" on-change="_onChangeClaimType">Set individually</paper-toggle-button>
            </template>

            <template is="dom-if" if="[[ _claimTypeIndividual ]]">
                <div class="info">
                    <p>Every employee sets its own configuration.</p>
                    <p>Disable it in order to manage resource configuration for all employees.</p>
                </div>
            </template>

            <iron-form id="saveResourceClaimsForm" headers="[[ _headers ]]" on-iron-form-presubmit="_onClaimsFormPresubmit" on-iron-form-error="_onClaimsFormError" on-iron-form-response="_onClaimsFormResponse" on-keyup="_onInputKeyUp">
                <form class="claims-form" method="POST" action="[[ _updateClaimsAction ]]">
                </form>
            </iron-form>
            <template is="dom-if" if="[[ !_claimTypeIndividual ]]">
                <template is="dom-if" if="[[ !isDialog ]]">
                    <p class="info user-can-edit-info">
                        If this option is turned on, all users you have shared this resource to will be able to edit it.
                    </p>
                    <paper-toggle-button class="user-can-edit-toggle" checked\$="[[ _userCanEdit ]]" on-change="_onChangeUserCanEdit">User can edit resource</paper-toggle-button>
                </template>

                <template is="dom-if" if="[[ _unPwAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-unpw data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]"></appsco-application-form-unpw>
                </template>

                <template is="dom-if" if="[[ _itemAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-item data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]"></appsco-application-form-item>
                </template>

                <template is="dom-if" if="[[ _creditCardAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-cc data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]"></appsco-application-form-cc>
                </template>

                <template is="dom-if" if="[[ _loginAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-login data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]"></appsco-application-form-login>
                </template>

                <template is="dom-if" if="[[ _passportAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-passport data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]"></appsco-application-form-passport>
                </template>

                <template is="dom-if" if="[[ _secureNoteAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-securenote data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]"></appsco-application-form-securenote>
                </template>

                <template is="dom-if" if="[[ _softwareLicenceAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-softwarelicence data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]"></appsco-application-form-softwarelicence>
                </template>

                <template is="dom-if" if="[[ _samlAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-saml data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]" domain="[[ domain ]]"></appsco-application-form-saml>
                </template>

                <template is="dom-if" if="[[ _openIDAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-open-id data-claims="" application="application" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]" domain="[[ domain ]]"></appsco-application-form-open-id>
                </template>
                
                <template is="dom-if" if="[[ _auroraFilesAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-aurora-files data-claims="" application="application" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]" domain="[[ domain ]]"></appsco-application-form-aurora-files>
                </template>

                <template is="dom-if" if="[[ _samlDropBoxAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-saml-dropbox data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]" domain="[[ domain ]]"></appsco-application-form-saml-dropbox>
                </template>

                <template is="dom-if" if="[[ _samlOffice365AuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-saml-office-365 data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]" domain="[[ domain ]]"></appsco-application-form-saml-office-365>
                </template>
                
                <template is="dom-if" if="[[ _rdpAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-rdp data-claims="" claims-name-prefix="application_claims[claims]" claims="[[ resource.claims ]]" domain="[[ domain ]]"></appsco-application-form-rdp>
                </template>
            </template>
        </div>


        <template is="dom-if" if="[[ !isDialog ]]">
            <paper-button class="save-action" on-tap="_onSaveAction">Save</paper-button>
        </template>
`;
    }

    static get is() {
        return 'appsco-company-resource-settings';
    }

    static get properties() {
        return {
            resource: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            domain: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _updateConfigurationAction: {
                type: String,
                computed: '_computeUpdateConfigurationAction(resource)'
            },

            _updateClaimsAction: {
                type: String,
                computed: '_computeUpdateClaimsAction(resource)'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _resourceConfigurationForm: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _resourceClaimsForm: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _resourceClaimsActiveForm: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _claimTypeSwitchPermission: {
                type: Boolean,
                computed: '_computeClaimTypeSwitchPermission(resource)'
            },

            _claimTypeIndividual: {
                type: Boolean,
                computed: '_computeClaimTypeIndividual(resource)',
                observer: '_onClaimTypeChanged'
            },

            _userCanEdit: {
                type: Boolean,
                computed: '_computeUserCanEdit(resource)'
            },

            _urlValidationPattern: {
                type: String,
                computed: '_computeUrlValidationPattern(resource)'
            },

            _supportedAuthTypes: {
                type: Array,
                value: function () {
                    return [
                        'icon_item', 'icon_unpw', 'icon_saml', 'icon_jwt', 'icon_cc', 'icon_login',
                        'icon_passport', 'icon_securenote', 'icon_softwarelicence', 'icon_none', 'icon_rdp'
                    ]
                }
            },

            animationConfig: {
                type: Object
            },

            _configureUrlPermission: {
                type: Boolean,
                computed: '_computeConfigureUrlPermission(resource)'
            },

            _unPwAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "unpw")'
            },

            _itemAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "item")'
            },

            _creditCardAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "cc")'
            },

            _loginAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "login")'
            },

            _passportAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "passport")'
            },

            _secureNoteAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "securenote")'
            },

            _softwareLicenceAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "softwarelicence")'
            },

            _samlAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "saml")'
            },

            _openIDAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "open_id")'
            },

            _auroraFilesAuthType: {
                type: Boolean,
                computed: '_computeAuthType(resource, "aurora_files")'
            },

            _samlDropBoxAuthType: {
                type: Boolean,
                computed: "_computeAuthType(resource, 'saml_dropbox')"
            },

            _samlOffice365AuthType: {
                type: Boolean,
                computed: "_computeAuthType(resource, 'saml_office_365')"
            },

            _rdpAuthType: {
                type: Boolean,
                computed: "_computeAuthType(resource, 'rdp')"
            },

            isDialog: {
                type: Boolean,
                value: false
            },

            _provisioningSupportList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: 'none',
                            name: 'No user management'
                        },
                        {
                            value: 'manual',
                            name: 'Users handled manually'
                        },
                        {
                            value: 'automatic',
                            name: 'Users handled by AppsCo automatically'
                        }
                    ];
                }
            },

            _preselectedProvisioningSupport: {
                type: String,
                computed: '_computePreselectedProvisioningSupport(resource, _provisioningSupportList)'
            }
        };
    }

    ready() {
        super.ready();

        this._resourceConfigurationForm = this.$.saveResourceConfigurationForm;
        this._resourceClaimsForm = this.$.saveResourceClaimsForm;

        this.animationConfig = {
            'entry': {
                name: 'scale-up-animation',
                node: this.$.saveResourceClaimsForm,
                transformOrigin: '0 0',
                axis: 'y',
                timing: {
                    duration: 200
                }
            },
            'exit': {
                name: 'scale-down-animation',
                node: this.$.saveResourceClaimsForm,
                transformOrigin: '0 0',
                axis: 'y',
                timing: {
                    duration: 100
                }
            }
        };

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('iron-overlay-closed', this._stopPropagation);
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
    }

    setup() {}

    reset() {
        const resource = JSON.parse(JSON.stringify(this.resource));

        if (this._resourceClaimsActiveForm && this._resourceClaimsActiveForm.$) {
            this._resourceClaimsActiveForm.reset();
        }

        this._resourceConfigurationForm.reset();
        this._resourceClaimsForm.reset();
        this._hideError();
        this._hideLoader();

        setTimeout(function () {
            this.set('resource', {});
            this.set('resource', resource);
        }.bind(this), 10);
    }

    _computePreselectedProvisioningSupport(resource, list) {
        return (resource && resource.provisioning) ? resource.provisioning : list[0].value;
    }

    _stopPropagation(event) {
        event.stopPropagation();
    }

    _onResourceChanged(resource) {
        this._claimTypeIndividual = (resource.self && ('individual' === resource.claim_type));
    }

    _onAuthTypeChanged() {
        this.set('_resourceClaimsActiveForm', dom(this.root).querySelector('[data-claims]'));
    }

    _computeClaimTypeSwitchPermission(resource) {
        return resource.self && resource.claim_type_editable;
    }

    _computeClaimTypeIndividual(resource) {
        return resource.self && 'individual' === resource.claim_type;
    }

    _computeConfigureUrlPermission(resource) {
        return resource.self && resource.url_editable;
    }

    _computeUpdateConfigurationAction(resource) {
        return resource.self ? resource.self : '';
    }

    _computeUpdateClaimsAction(resource) {
        return resource.self ? resource.meta.update_claims : '';
    }

    _computeAuthType(resource, authType) {
        return (resource.auth_type && resource.auth_type === authType);
    }

    _computeUrlValidationPattern(resource) {
        const defaultPattern = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?|^((http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$',
            allowFtpPattern = '^(http:\\/\\/|https:\\/\\/|ftp:\\/\\/|ftps:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?|^((http:\\/\\/|https:\\/\\/|ftp:\\/\\/|ftps:\\/\\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$';

        const auth = resource.auth_type;
        return (['login', 'none'].indexOf(auth) !== -1) ? allowFtpPattern : defaultPattern;
    }

    _computeUserCanEdit(resource) {
        return resource.self && !!resource.user_can_edit;
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

    _showClaimsForm() {
        if (Object.keys(this._resourceClaimsForm).length > 0) {
            this._resourceClaimsForm.updateStyles({'display': 'block'});
            this.playAnimation('entry');
        }
    }

    _hideClaimsForm() {
        this._resetClaimsForm();
        this.playAnimation('exit');
    }

    _resetClaimsForm() {
        if (Object.keys(this._resourceClaimsForm).length > 0) {
            this._resourceClaimsForm.reset();
        }
    }

    _onClaimTypeChanged(individual) {
        individual ? this._hideClaimsForm() : this._showClaimsForm();
    }

    _onConfigurationFormPresubmit(event) {
        const form = event.target;

        form.request.method = 'PATCH';
        form.request.body['configure_application[provisioning]'] = encodeURIComponent(this.$.provisioningSupportList.selectedItem.value);
    }

    _onConfigurationFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.error.code));
        this._hideLoader();
    }

    _onConfigurationFormResponse(event) {
        if (this._resourceClaimsActiveForm) {
            this._submitClaimsForm();
        } else {
            this._resourceSettingsSaved(event.detail.response);
        }
    }

    _onChangeUserCanEdit(event) {
        const request = document.createElement('iron-request'),
            options = {
                url: this._updateClaimsAction,
                method: 'PATCH',
                handleAs: 'json',
                headers: this._headers,
                body: 'application_claims[user_can_edit]=' + event.target.checked
            };

        this._showLoader();

        request.send(options).then(function () {
            if (200 === request.status) {
                const resource = request.response;
                this.set('resource', resource);
                this._hideLoader();
            }
        }.bind(this), function () {
            this._showError(this.apiErrors.getError(request.error.code));
        }.bind(this));
    }

    _onChangeClaimType() {
        const request = document.createElement('iron-request'),
            options = {
                url: this._updateClaimsAction,
                method: 'PATCH',
                handleAs: 'json',
                headers: this._headers,
                body: 'application_claims[claim_type]=' + !this._claimTypeIndividual
            };

        this._showLoader();

        request.send(options).then(function () {
            if (200 === request.status) {
                const resource = request.response;

                this.set('resource', resource);

                this.dispatchEvent(new CustomEvent('claim-type-changed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        application: resource
                    }
                }));

                this._hideLoader();
            }
        }.bind(this), function () {
            this._showError(this.apiErrors.getError(request.error.code));
        }.bind(this));
    }

    _onClaimsFormPresubmit(event) {
        const form = event.target,
            formSettings = this._resourceClaimsActiveForm;

        this._loader = true;
        form.request.method = 'PATCH';

        if (formSettings && formSettings.$) {
            form.request.body = formSettings.encodedBodyValues();
        }
    }

    _onClaimsFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.error.code));
        this._hideLoader();
    }

    _onClaimsFormResponse(event) {
        this._resourceSettingsSaved(event.detail.response);
    }

    _submitConfigurationForm() {
        if (this._resourceConfigurationForm.validate()) {
            this._showLoader();
            this._resourceConfigurationForm.submit();
        }
    }

    _submitClaimsForm() {
        const form = this._resourceClaimsActiveForm;

        if (form) {
            this._resourceClaimsForm.submit();
        }
    }

    _onSaveAction() {
        this._hideError();
        if (this._resourceClaimsActiveForm && this._resourceClaimsActiveForm.$ && !this._claimTypeIndividual) {
            const claimsForm = this._resourceClaimsActiveForm,
                claimsFormValid = claimsForm.isValid();

            if (claimsFormValid) {
                this._submitConfigurationForm();
            }
        } else {
            this._submitConfigurationForm();
        }
    }

    _resourceSettingsSaved(resource) {
        if (resource && resource.self) {
            this.set('resource', resource);

            this.dispatchEvent(new CustomEvent('application-settings-saved', {
                bubbles: true,
                composed: true,
                detail: {
                    application: resource
                }
            }));
        }

        this._hideLoader();
    }

    _onNeonAnimationFinish() {
        if (this._claimTypeIndividual && this._resourceClaimsForm) {
            this._resourceClaimsForm.style.display = 'none';
        }
    }

    save(callback) {
        this._onSaveAction();
        callback();
    }
}
window.customElements.define(AppscoCompanyResourceSettings.is, AppscoCompanyResourceSettings);
