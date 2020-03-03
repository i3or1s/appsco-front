import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDirectoryAddAccount extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-directory-add-account;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host paper-input {
                --paper-input-container-label: {
                    left: 4px;
                };
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host .info {
                margin: 0;
            }
            :host .mt {
                margin-top: 15px;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
            }
            :host .flex-horizontal > div {
                padding-right: 10px;
            }
            :host .flex{
                @apply --layout-flex;
            }
            :host .baseline {
                @apply --layout-self-end;
                padding-bottom: 10px;
                text-align: center;
            }
            paper-toggle-button {
                cursor: pointer;
            }
        </style>

        <paper-dialog id="addAccountDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add account to Directory</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ addCompanyRoleApi ]]">
                            <div>
                                <p class="info">
                                    First name and last name are important since they associate degree of confidence.
                                    They will be used for log purposes, statistics and other reporting activities.
                                    Beside usage in AppsCo they can also be used for integration with other tools.
                                </p>
                                <div class="flex-horizontal">
                                    <div class="flex">
                                        <paper-input id="accountFirstName" label="First name" name="register_account[firstName]" required="" auto-validate="" error-message="Please provide first name."></paper-input>
                                    </div>
                                    <div class="flex">
                                        <paper-input id="accountLastName" label="Last name" name="register_account[lastName]" required="" auto-validate="" error-message="Please provide last name."></paper-input>
                                    </div>
                                </div>
                                <p class="info mt">
                                    Email is used as part of credentials for accessing the system.
                                    Email can be used for log purposes, statistics and other reporting activities.
                                </p>
                                <div class="flex-horizontal">
                                    <div class="flex">
                                        <paper-input id="accountEmail" type="email" label="Email" value="" name="register_account[email]" required="" auto-validate="" error-message="Please provide valid email."></paper-input>
                                    </div>
                                    <div class="baseline">
                                        <paper-toggle-button id="sendActivationEmail" name="register_account[notify]" checked="">
                                            Send Activation Email</paper-toggle-button>
                                    </div>
                                </div>
                                <p class="info mt">
                                    Accounts which already exist on AppsCo will be added to the directory.
                                    If the account does not exist an invitation will be created.
                                    You can find all invitations in the directory drop-down.
                                </p>
                            </div>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_submitForm" id="addAccountDialogButton">Add</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-directory-add-account'; }

    static get properties() {
        return {
            addCompanyRoleApi: {
                type: String
            },

            addInvitationApi: {
                type: String
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
            }
        };
    }

    toggle() {
        this.$.addAccountDialog.toggle();
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

    _onDialogOpened() {
        this.$.accountFirstName.focus();
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this.$.form.reset();
    }

    _onEnter() {
        this._submitForm();
    }

    _submitForm() {
        const form = this.$.form;

        if (form.validate()) {
            this._showLoader();
            form.submit();
        }
    }

    _onFormPresubmit(event) {
        event.target.request.body['register_account[companyRoles][COMPANY_ROLE_EMPLOYEE]'] = 'COMPANY_ROLE_EMPLOYEE';
    }

    _onFormError(event) {
        const code = event.detail.request.response.code;

        if (1499245162 === code) {
            this._createInvitation(event.target);
            return false;
        }

        this._showError(this.apiErrors.getError(code));
        this._hideLoader();
    }

    _onFormResponse(event) {
        const response = event.detail.response;

        if (200 === event.detail.status && response) {
            this.$.addAccountDialog.close();

            this.dispatchEvent(new CustomEvent('company-role-created', {
                bubbles: true,
                composed: true,
                detail: {
                    role: response
                }
            }));
        }
    }

    _createInvitation(form) {
        const formData = form.serializeForm(),
            request = document.createElement('iron-request'),
            options = {
                url: this.addInvitationApi,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };

        let body = 'invitation[type]=user';

        for (const key in formData) {
            body += '&' + key.replace('register_account', 'invitation') + '=' + encodeURIComponent(formData[key]);
        }

        options.body = body;

        request.send(options).then(function() {
            if (200 === request.status) {
                this.$.addAccountDialog.close();

                this.dispatchEvent(new CustomEvent('invitation-created', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        invitation: request.response
                    }
                }));
            }
        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }
}
window.customElements.define(AppscoDirectoryAddAccount.is, AppscoDirectoryAddAccount);
