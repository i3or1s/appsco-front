import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-form/iron-form.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIdpResourceAdd extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons {
                padding-right: 24px;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button.add-action {
                margin: 0 0 0 10px;
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>

        <paper-dialog id="addResourceDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add resource</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <iron-form id="addResourceForm" hidden="" headers="[[ _headers ]]" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ addResourceApi ]]">
                            <paper-input type="text" name="application_templates[]" value="[[ link.self ]]"></paper-input>
                        </form>
                    </iron-form>

                    <iron-form id="saveResourceForm">
                        <form>
                            <paper-input id="title" label="title" value="[[ resource.title ]]" name="configure_application[title]" required="" auto-validate="" error-message="Please enter resource title."></paper-input>
                            <paper-input id="url" label="url" value="[[ resource.url ]]" pattern="[[ _urlValidationPattern ]]" error-message="Url is invalid." required="" auto-validate="" name="configure_application[url]" hidden\$="[[ !_shouldShowUrl ]]"></paper-input>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button id="addResourceAction" class="add-action" on-tap="_onAddResourceAction">
                    Add
                </paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-idp-resource-add'; }

    static get properties() {
        return {
            addResourceApi: {
                type: String
            },

            resource: {
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

            link: {
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

        this._target = this.$.addResourceForm;
    }

    open() {
        this._openDialog();
    }

    setResource(resource) {
        this.set('resource', resource);
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

    _openDialog() {
        this.$.addResourceDialog.open();
    }

    _closeDialog() {
        this.$.addResourceDialog.close();
    }

    _onDialogOpened() {
        this.$.title.focus();
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this.set('resource', {});
    }

    _onEnter() {
        this._onAddResourceAction();
    }

    _onAddResourceAction() {
        this._hideError();
        if (this.shadowRoot.getElementById('saveResourceForm').validate()) {
            this._showLoader();
            this._target.submit();
        }
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    /**
     * Called after resource is added as icon.
     * It calls resource configure method.
     *
     * @param {Object} event
     * @private
     */
    _onFormResponse(event) {
        const resources = event.detail.response.applications;

        if (resources && 0 < resources.length) {
            this._updateResourceSettings(resources[0]);
        }
        else {
            this._showError(this.apiErrors.getError(404));
            this._hideLoader();
        }
    }

    _updateResourceSettings(resource) {
        const title = this.$.title.value,
            url = this.$.url.value;

        if (resource.title !== title || resource.url !== url) {
            this._submitResourceConfigure(resource).then(function(resource) {
                this._onResourceAdded(resource);
            }.bind(this), function(message) {
                this._showError(message);
                this._hideLoader();
            }.bind(this));
        }
        else {
            this._onResourceAdded(resource);
        }
    }

    _submitResourceConfigure(resource) {
        const titleInput = this.$.title,
            urlInput = this.$.url;

        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: resource.self,
                    method: 'PATCH',
                    handleAs: 'json',
                    headers: this._headers
                };

            let body = encodeURIComponent(titleInput.name) + '=' + encodeURIComponent(titleInput.value);
            body += '&';
            body += encodeURIComponent(urlInput.name) + '=' + encodeURIComponent(urlInput.value);

            options.body = body;

            request.send(options).then(function() {
                if (request.succeeded) {
                    resolve(request.response);
                }
            }, function() {
                reject(this.apiErrors.getError(request.response.code));
            });
        }.bind(this));
    }

    _onResourceAdded(resource) {
        this.dispatchEvent(new CustomEvent('resource-added', {
            bubbles: true,
            composed: true,
            detail: {
                template: this.resource,
                resource: resource
            }
        }));

        this._closeDialog();
    }
}
window.customElements.define(AppscoIdpResourceAdd.is, AppscoIdpResourceAdd);
