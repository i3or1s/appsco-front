import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/iron-form/iron-form.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import '../components/appsco-loader.js';
import './appsco-folders-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoFoldersRename extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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

            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <h2>Rename dashboard folder </h2>

            <div>
                <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>
                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                <paper-input id="title" label="Enter dashboard folder name" value="[[ folderItem.title]]" name="title" required="" auto-validate="" error-message="Please enter folder title."></paper-input>
                <iron-a11y-keys keys="enter" on-keys-pressed="_renameFolder"></iron-a11y-keys>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button on-click="_renameFolder">Save</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-folders-rename'; }

    static get properties() {
        return {
            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            foldersApi: {
                type: String
            },

            folderItem: {
                type: String,
                value: ''
            },

            _company: {
                type: String,
                value: ''
            },

            _errorMessage: {
                type: String,
                value: ''
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    _renameFolder() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.folderItem.self,
                body: 'dashboardGroup[title]=' + this.$.title.value,
                method: 'PATCH',
                handleAs: 'json',
                headers: this._headers
            };

        this._showLoader();
        this._hideError();

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('folder-renamed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        folder: this.folderItem
                    }
                }));

                this._hideLoader();
                this.$.dialog.close();
            }
        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
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

    setCompany(company) {
        this._company = company;
    }

    setFolderItem(folderItem) {
        this.folderItem = folderItem;
    }

    toggle() {
        this.$.dialog.toggle();
    }
}
window.customElements.define(AppscoFoldersRename.is, AppscoFoldersRename);
