import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-form-error.js';
import '../appsco-application-form-cc.js';
import '../appsco-application-form-unpw.js';
import '../appsco-application-form-item.js';
import '../appsco-application-form-passport.js';
import '../appsco-application-form-login.js';
import '../appsco-application-form-securenote.js';
import '../appsco-application-form-softwarelicence.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAssigneeClaims extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
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
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Change claims for [[ assignee.display_name ]]</h2>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is revoking access" multi-color=""></appsco-loader>

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse" on-keyup="_onFormKeyUp">
                        <form method="POST" action="[[ _computedAction ]]">
                        </form>
                    </iron-form>

                    <template is="dom-if" if="[[ _unPwAuth ]]" restamp="">
                        <appsco-application-form-unpw data-claims="" claims-name-prefix="account_claims[claims]" claims="[[ _applicationIcon.claims ]]"></appsco-application-form-unpw>
                    </template>
                    <template is="dom-if" if="[[ _itemAuth ]]" restamp="">
                        <appsco-application-form-item data-claims="" claims-name-prefix="account_claims[claims]" claims="[[ _applicationIcon.claims ]]"></appsco-application-form-item>
                    </template>
                    <template is="dom-if" if="[[ _creditCardAuth ]]" restamp="">
                        <appsco-application-form-cc data-claims="" claims-name-prefix="account_claims[claims]" claims="[[ _applicationIcon.claims ]]"></appsco-application-form-cc>
                    </template>
                    <template is="dom-if" if="[[ _loginAuth ]]" restamp="">
                        <appsco-application-form-login data-claims="" claims-name-prefix="account_claims[claims]" claims="[[ _applicationIcon.claims ]]"></appsco-application-form-login>
                    </template>
                    <template is="dom-if" if="[[ _passportAuth ]]" restamp="">
                        <appsco-application-form-passport data-claims="" claims-name-prefix="account_claims[claims]" claims="[[ _applicationIcon.claims ]]"></appsco-application-form-passport>
                    </template>
                    <template is="dom-if" if="[[ _secureNoteAuth ]]" restamp="">
                        <appsco-application-form-securenote data-claims="" claims-name-prefix="account_claims[claims]" claims="[[ _applicationIcon.claims ]]"></appsco-application-form-securenote>
                    </template>
                    <template is="dom-if" if="[[ _softwareLicenceAuth ]]" restamp="">
                        <appsco-application-form-softwarelicence data-claims="" claims-name-prefix="account_claims[claims]" claims="[[ _applicationIcon.claims ]]"></appsco-application-form-softwarelicence>
                    </template>

                    <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
                    </iron-a11y-keys>

                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button on-tap="_submit">Save</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-application-assignee-claims'; }

    static get properties() {
        return {
            /**
             * Application instance to change claims for.
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onChange'
            },

            _unPwAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'unpw')"
            },
            _itemAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'item')"
            },
            _creditCardAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'cc')"
            },
            _loginAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'login')"
            },
            _passportAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'passport')"
            },
            _secureNoteAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'securenote')"
            },
            _softwareLicenceAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'softwarelicence')"
            },

            _applicationIcon: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            /**
             * Assignee to change claims for.
             */
            assignee: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onChange'
            },

            _computedAction: {
                type: Object,
                computed: "_computeAction(application)"
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            /**
             * Target for iron-a11y-keys component.
             * Submit form on enter.
             */
            _target: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this._target = this.$.form;
    }

    _computeAuthType(application, authType) {
        return application.auth_type === authType;
    }

    toggle() {
        this.$.dialog.toggle();
    }

    setApplication(application) {
        this.set('application', application);
    }

    setAssignee(assignee) {
        this.set('assignee', assignee);
    }

    _getApplicationIcon() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.application.meta.account_icon,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers,
                body: 'account=' + encodeURIComponent(this.assignee.self)
            };

        request.send(options).then(function() {
            this._applicationIcon = request.response;
        }.bind(this));
    }

    _onChange() {
        if (this.application.self && this.assignee.self) {
            this._getApplicationIcon();
        }
    }

    _onDialogOpened() {}

    _onDialogClosed() {
        this.set('application', {});
        this.set('_applicationIcon', {});
        this.set('assignee', {});
        this.reset();
    }

    _computeAction(application) {
        return application.meta ? application.meta.account_claims : null;
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _onFormKeyUp() {
        this._errorMessage = '';
    }

    /**
     * Submits signup form on ENTER key using iron-a11y-keys component.
     *
     * @private
     */
    _onEnter() {
        this._submit();
    }

    _submit() {
        const form = dom(this.root).querySelector('[data-claims]');

        if(!form.isValid()) {
            return false;
        }
        if(!form.didFieldsChanged()) {
            this._showLoader();

            this.dispatchEvent(new CustomEvent('claims-changed', {
                bubbles: true,
                composed: true,
                detail: {
                    application: this.application,
                    assignee: this.assignee
                }
            }));

            this.$.dialog.close();
            return false;
        }

        this.$.form.submit();
    }

    _onFormPresubmit() {
        const form = this.$.form,
            formSettings = dom(this.root).querySelector('[data-claims]');

        this._showLoader();
        form.request.method = 'PUT';
        form.request.body = formSettings.encodedBodyValues();
        form.request.body += '&' + encodeURIComponent('account_claims[account]') +
            '=' + encodeURIComponent(this.assignee.self);
    }

    /**
     * Called on form error when trying to save settings.
     *
     * @param {Object} event
     * @private
     */
    _onFormError(event) {
        this._errorMessage = event.detail.error.message;
        this._hideLoader();
    }

    /**
     * Called after settings have been submitted.
     *
     * @param {Object} event
     * @private
     */
    _onFormResponse(event) {
        this.dispatchEvent(new CustomEvent('claims-changed', {
            bubbles: true,
            composed: true,
            detail: {
                application: event.detail.response,
                assignee: this.assignee
            }
        }));

        this.reset();

        this.$.dialog.close();
    }

    reset() {
        this._errorMessage = '';
        this._hideLoader();
    }
}
window.customElements.define(AppscoApplicationAssigneeClaims.is, AppscoApplicationAssigneeClaims);
