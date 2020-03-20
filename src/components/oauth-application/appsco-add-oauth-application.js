import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-image/iron-image.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAddOAuthApplication extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host .application-image {
                width: 64px;
                height: 64px;
                margin-left: 20px;
            }
            :host .horizontal-align {
                @apply --layout-horizontal;
            }
            :host .flex {
                @apply --layout-flex;
            }
            :host .no-flex {
                @apply --layout-flex-none;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add OAuth application</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ oauthApplicationsApi ]]">
                            <div class="input-container">
                                <paper-input id="title" label="Title" name="oauth_application[title]" required="" auto-validate="" error-message="Please enter title of the application."></paper-input>
                            </div>

                            <div class="input-container">
                                <paper-input label="Redirect URL" name="oauth_application[redirect_url]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" auto-validate="" error-message="Please enter valid URL."></paper-input>
                            </div>

                            <div class="input-container">
                                <paper-input label="Website URL" name="oauth_application[website_url]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" auto-validate="" error-message="Please enter valid URL."></paper-input>
                            </div>

                            <div class="input-container horizontal-align">
                                <paper-input label="Icon" name="oauth_application[icon_url]" value\$="[[ _applicationIcon ]]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" auto-validate="" error-message="Please enter valid icon URL." class="flex" on-value-changed="_onIconInputValueChanged"></paper-input>

                                <iron-image class="application-image no-flex" src\$="[[ _applicationIcon ]]" alt="Application image" preload="" fade="" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="contain"></iron-image>
                            </div>

                            <div class="input-container">
                                <paper-textarea label="Description" name="oauth_application[description]" value="" rows="3"></paper-textarea>
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

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-add-oauth-application'; }

    static get properties() {
        return {
            oauthApplicationsApi: {
                type: String
            },

            company: {
                type: Object,
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
            },

            _applicationIcon: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_onCompanyChanged(company)'
        ];
    }

    ready() {
        super.ready();

        this._target = this.$.form;
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
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

    _initialize() {
        this._onCompanyChanged(this.company);
        this.$.title.focus();
    }

    _reset() {
        this._target.reset();
    }

    _onDialogOpened() {
        this._initialize();
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this._reset();
    }

    _onCompanyChanged(company) {
        if (company.image) {
            this._applicationIcon = company.image;
        }
    }

    _onIconInputValueChanged(event) {
        if (!event.detail.value) {
            return;
        }
        this.debounce('setIconURL', function() {
            this._applicationIcon = event.detail.value;
        }.bind(this), 500);
    }

    _onEnterAction() {
        this._onAddAction();
    }

    _onAddAction() {
        this._hideError();

        if (this._target.validate()) {
            this._showLoader();
            this._target.submit();
        }

    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    _onFormResponse(event) {
        this.close();

        this.dispatchEvent(new CustomEvent('oauth-application-added', {
            bubbles: true,
            composed: true,
            detail: {
                application: event.detail.response
            }
        }));
    }
}
window.customElements.define(AppscoAddOAuthApplication.is, AppscoAddOAuthApplication);
