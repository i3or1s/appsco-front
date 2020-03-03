import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@vaadin/vaadin-upload/vaadin-upload.js';
import './appsco-loader.js';
import './appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoImportResource extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-import-resource;
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
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            vaadin-upload {
                --vaadin-upload-button-add: {
                    @apply --primary-button;
                }
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <slot name="title" old-content-selector="[title]"></slot>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <slot name="info" old-content-selector="[info]"></slot>

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <div>
                        <vaadin-upload id="uploadCsv" max-file-size="1000000" accept=".csv, text/csv, application/csv, application/excel, application/vnd.ms-excel" target="[[ importApi ]]" on-upload-start="_uploadStarted" on-file-reject="_fileRejected" on-upload-error="_uploadErrorResponse" on-upload-success="_uploadSuccess" headers="[[ _authorizationHeaders ]]">
                            <iron-icon icon="file-upload" slot="drop-label-icon"></iron-icon>
                            <span class="drop-label" slot="drop-label">Upload resource</span>
                        </vaadin-upload>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-import-resource'; }

    static get properties() {
        return {
            importApi: {
                type: String
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

    ready() {
        super.ready();

        this.$.uploadCsv.set('i18n.addFiles.many', 'Upload file');
    }

    toggle() {
        this.$.dialog.toggle();
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    _onDialogOpened() {
        this._loader = false;
        this._errorMessage = '';
        this.$.uploadCsv.files = [];
    }

    _onDialogClosed() {
        this._loader = false;
        this._errorMessage = '';
        this.$.uploadCsv.files = [];
    }

    _uploadStarted(e) {}

    _fileRejected(e) {
        this._errorMessage = e.detail.error;
    }

    _uploadErrorResponse(e) {
        if (e.detail.xhr.status === 402) {
            e.detail.file.error = "Maximum subscription reached. Please upgrade before import.";
        }
    }

    _uploadSuccess(event) {
        this.close();

        this.dispatchEvent(new CustomEvent('import-finished', {
            bubbles: true,
            composed: true,
            detail: {
                response: JSON.parse(event.detail.xhr.response)
            }
        }));
    }
}
window.customElements.define(AppscoImportResource.is, AppscoImportResource);
