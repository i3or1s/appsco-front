import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAddContact extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-add-contact;
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
                @apply --layout-center;
            }
            :host .flex-horizontal > div:first-child {
                padding-right: 10px;
            }
            :host .flex{
                @apply --layout-flex;
            }
            :host .baseline{
                @apply --layout-self-end;
                padding-bottom: 10px;
            }
            paper-toggle-button {
                cursor: pointer;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add contact</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ addContactApi ]]">
                            <div>
                                <p class="info">
                                    First name and last name are required and displayed on the contact card.
                                </p>
                                <div class="flex-horizontal">
                                    <div class="flex">
                                        <paper-input id="firstName" label="First name" name="contact[firstName]" required="" auto-validate="" error-message="Please provide first name."></paper-input>
                                    </div>

                                    <div class="flex">
                                        <paper-input id="lastName" label="Last name" name="contact[lastName]" required="" auto-validate="" error-message="Please provide last name."></paper-input>
                                    </div>
                                </div>
                                <p class="info mt">
                                    Email is used as part of the credentials for accessing the system.
                                    Email will also be used for log purposes, statistics and other reporting activities.
                                </p>
                                <div class="flex-horizontal">
                                    <div class="flex">
                                        <paper-input id="email" type="email" label="Email" value="" name="contact[email]" required="" auto-validate="" error-message="Please provide valid email."></paper-input>
                                    </div>

                                    <div class="baseline">
                                        <paper-toggle-button id="sendActivationEmail" name="invitation[notify]">Send Activation Email</paper-toggle-button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAddAction">Add</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-add-contact'; }

    static get properties() {
        return {
            addContactApi: {
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
        this.$.dialog.toggle();
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
        this.$.firstName.focus();
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this.$.form.reset();
    }

    _onEnter() {
        this._onAddAction();
    }

    _onAddAction() {
        const form = this.$.form;

        if (form.validate()) {
            this._showLoader();
            form.submit();
        }
    }

    _onFormError(event) {
        const code = event.detail.request.response.code;

        if (1499245276 == code) {
            this._createInvitation(event.target);
            return false;
        }

        this._showError(this.apiErrors.getError(code));
        this._hideLoader();
    }

    _onFormResponse(event) {
        const response = event.detail.response;

        if (200 === event.detail.status && response) {
            this.$.dialog.close();

            this.dispatchEvent(new CustomEvent('contact-created', {
                bubbles: true,
                composed: true,
                detail: {
                    contact: response
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

        let body = 'invitation[type]=contact';

        for (const key in formData) {
            body += '&' + key.replace('contact', 'invitation') + '=' + encodeURIComponent(formData[key]);
        }

        options.body = body;

        request.send(options).then(function() {
            if (200 === request.status) {
                this.$.dialog.close();

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
window.customElements.define(AppscoAddContact.is, AppscoAddContact);
