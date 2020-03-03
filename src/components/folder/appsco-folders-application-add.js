import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import '../components/appsco-loader.js';
import './appsco-folders-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoFoldersApplicationAdd extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;

                --paper-dialog-scrollable: {
                    min-height: 220px;
                };
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }

            :host paper-dialog-scrollable {
                height: 340px;
            }

            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            .dialog-container {
                height: 420px;
            }
            appsco-search {
                margin-bottom: 15px;
                margin-left: 10px;
                width: 590px;
            }
            .folder-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                padding: 2px;
                margin-right: -8px;
                margin-left: -18px;
            }

            appsco-folders-item {
                width: 100%;

                --item-icon-width: 32px;
                --item-icon-height: 32px;

                --appsco-list-item: {
                    box-shadow: none;
                    padding: 5px 0;
                    height: auto;
                    border-bottom: 1px solid var(--border-color);
                };

                --appsco-list-item-activated: {
                    box-shadow: none;
                    background-color: var(--body-background-color);
                };

                --item-info-label: {
                    font-size: 14px;
                };

                --item-info-value: {
                    display: none;
                };
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <h2>Move to folder</h2>

            <div class="dialog-container">

                <iron-ajax id="getFoldersListRequest" method="GET" url="[[ _foldersListApi ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onAvailableFoldersResponse" on-error="_onErrorResponse"></iron-ajax>

                <appsco-search id="appscoSearch" label="Search available folders" float-label="" on-search="_onSearch" on-search-clear="_onClearSearch"></appsco-search>

                <paper-dialog-scrollable>
                    <div class="folder-list">

                        <appsco-loader active="[[ _searchLoader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

                        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                        <template is="dom-repeat" items="[[ _foldersListDisplay ]]">
                            <appsco-folders-item id="appscoListItem_[[ index ]]" item="[[ item ]]" on-item="_onListItemSelectAction"></appsco-folders-item>
                        </template>

                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">
                                [[ _message ]]
                            </p>
                        </template>
                    </div>
                </paper-dialog-scrollable>

            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-folders-application-add'; }

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

            currentFolder: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _applicationIcon: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _company: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _foldersListApi: {
                type: String,
                computed: '_computeFoldersListApi(foldersApi, _company)'
            },

            _foldersListDisplay: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _foldersList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String,
                value: ''
            },

            _errorMessage: {
                type: String,
                value: ''
            },

            _searchLoader: {
                type: Boolean,
                value: false
            }
        };
    }

    close() {
        this.$.dialog.close();
    }

    toggle() {
        this.$.dialog.toggle();
        this._showLoader();
        this.$.getFoldersListRequest.generateRequest();
    }

    setApplicationIcon(applicationIcon) {
        this._applicationIcon = applicationIcon;
    }

    setCurrentFolder(currentFolder) {
        this.currentFolder = currentFolder;
    }

    setCompany(company) {
        this._company = company;
    }

    _computeFoldersListApi(foldersApi, company) {
        if (company && company.self) {
            return company.self + '/dashboard-groups?extended=1';
        }
        return foldersApi ? foldersApi + '?extended=1' : null;
    }

    _onSearch(event) {
        this._searchList(event.detail.term);
    }

    _onClearSearch() {
        this._searchList('');
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _showLoader() {
        this._searchLoader = true;
    }

    _hideLoader() {
        this._searchLoader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _searchList(searchTerm) {
        const term = decodeURIComponent(searchTerm.toLowerCase()).trim(),
            termLength = term.length,
            list = this._foldersList,
            length = list.length;

        this._showLoader();

        this.set('_foldersListDisplay', []);

        if (length === 0) {
            this._showMessage('There are no available folders.');
            this._hideLoader();
            return false;
        }

        if (1 === termLength) {
            this._showMessage('Please type two or more letters.');
            this._hideLoader();
            return false;
        }

        this._hideMessage();

        for (let i = 0; i < length; i++) {
            const item = list[i];
            if (item && item.title.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                this.push('_foldersListDisplay', item);
            }
        }

        if (0 === this._foldersListDisplay.length && 2 <= termLength) {
            this._showMessage('There are no available folders with asked term.');
        }

        this._hideLoader();
    }

    _onAvailableFoldersResponse(event) {
        const response = event.detail.response;

        if (response && response.groups) {
            this.set('_foldersList', response.groups);
            this.set('_foldersListDisplay', response.groups);

            if (response.groups.length === 0 ) {
                this._showMessage('There are no available folders.');
            } else {
                this._hideMessage();
            }
        }
        this._hideLoader();
    }

    _onErrorResponse() {
        this._message = 'We couldn\'t load folders at the moment. Please try again in a minute.';
        this._hideLoader();
    }

    _onListItemSelectAction(event) {
        var selectedFolder = event.detail.item,
            applicationIcon = this._applicationIcon;
        this._moveToFolder(selectedFolder, applicationIcon);
    }

    _moveToFolder(selectedFolder, applicationIcon) {
        const request = document.createElement('iron-request'),
            options = {
                url: selectedFolder.self + '/resource/' + applicationIcon.alias,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };

        this._hideError();
        this._showLoader();

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('resource-moved-to-folder', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        resource: applicationIcon,
                        folder: selectedFolder,
                        sourceFolder: this.currentFolder
                    }
                }));

                this._hideLoader();
                this.close();
            }
        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }
}
window.customElements.define(AppscoFoldersApplicationAdd.is, AppscoFoldersApplicationAdd);
