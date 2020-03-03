import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyAddCertificate extends PolymerElement {
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
            .emphasized {
                font-weight: 500;
            }
            .support-link {
                color: var(--app-primary-color-dark);
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened">

            <h2>Add certificate</h2>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <div class="input-container">

                        <paper-textarea id="certificateName" label="Certificate" rows="5" required=""></paper-textarea>

                    </div>

                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_submitForm">Add</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-company-add-certificate'; }

    static get properties() {
        return {
            source: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _errorMessage: {
                type: String
            }
        };
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

    _onDialogOpened() {
        this.$.certificateName.focus();
    }

    _onEnter() {
        _submitForm();
    }

    _submitForm() {
        if (!this.$.certificateName.value) {
            this._errorMessage = 'Please enter certificate';
            return;
        }
        this.source.addCertificate(this.$.certificateName.value);
        this.$.certificateName.value = '';
        this.error = '';
        this.$.dialog.close();
    }

    setSource(event) {
        this.source = event.detail.source;
    }
}
window.customElements.define(AppscoCompanyAddCertificate.is, AppscoCompanyAddCertificate);
