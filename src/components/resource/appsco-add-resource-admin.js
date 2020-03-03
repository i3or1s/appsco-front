import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import './appsco-account-list-item.js';
import '../account/appsco-accounts.js';
import '../components/appsco-list-item-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAddResourceAdmin extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                display: block;
                position: relative;

                --paper-checkbox-unchecked-color: var(--secondary-text-color);
                --paper-checkbox-checked-color: var(--secondary-text-color);
                --paper-checkbox-size: 22px;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host paper-progress {
                width: 100%;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host appsco-form-error {
                box-sizing: border-box;
                margin-top: 0 !important;
            }
            .dialog-container {
                padding-bottom: 20px;
            }
            .filter-accounts {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-top: 0 !important;
            }
            appsco-search {
                margin-right: 20px;
                @apply --layout-flex;
            }
            paper-dropdown-menu {
                @apply --layou-flex-none;
                width: 150px;
                margin-top: 2px;

                --paper-input-container-input: {
                    font-size: 14px;
                    cursor: pointer;
                };
            }
            :host .item-info {
                padding: 0;
            }
            :host .info-value {
                font-size: 14px;
            }
            :host .item-type {
                text-transform: capitalize;
            }
            :host table {
                width: 100%;
                border-collapse: collapse;
            }
            :host table thead tr th {
                text-align: left;
                font-size: 16px;
                font-weight: normal;
                padding: 10px 4px;
                border-bottom: 1px solid var(--divider-color);
            }
            :host table thead tr th:first-of-type {
                width: 40px;
            }
            :host table thead tr th:last-of-type {
                width: 60px;
            }
            :host table tbody tr td {
                padding: 10px 4px 0;
            }
            :host paper-checkbox {
                width: 22px;
                margin: 0 auto 0 4px;
            }
            :host paper-checkbox::shadow paper-ripple {
                width: 200% !important;
                height: 200% !important;
                top: -50% !important;
                left: -50% !important;
            }
            :host .message {
                @apply --info-message;
            }
            :host .selected-info {
                height: 20px;
                position: absolute;
                top: 0;
                left: 24px;
                bottom: 0;
                margin: auto;
                font-size: 12px;
                color: var(--secondary-text-color);
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host *[hidden] {
                display: none;
            }
            :host div.error-container {
                height: 20px;
            }
        </style>

        <appsco-accounts hidden="" id="appscoRoles" type="account" size="1000" authorization-token="[[ authorizationToken ]]" list-api="[[ getRolesApi ]]" no-auto-load="" on-list-loaded="_onAccountsLoadFinished" on-filter-done="_onAccountsLoadFinished" on-list-empty="_onAccountsLoadFinished"></appsco-accounts>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Promote to resource admin</h2>

            <appsco-loader active="[[ _shareLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <div class="error-container">
                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
            </div>

            <div class="filter-accounts">
                <appsco-search id="appscoSearch" label="Search for accounts" float-label="" on-search="_onSearchAccounts" on-search-clear="_onSearchAccountsClear"></appsco-search>
            </div>

            <paper-dialog-scrollable>

                <div class="dialog-container">
                    <div class="account-list">
                        <paper-progress id="accountListProgress" indeterminate=""></paper-progress>
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    <paper-checkbox id="bulkSelect" on-tap="_onBulkSelect" checked\$="[[ _bulkSelect ]]"></paper-checkbox>
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                            </thead>

                            <tbody>
                            <template is="dom-repeat" items="[[ _accountList ]]">
                                <tr>
                                    <td>
                                        <appsco-account-list-item item="[[ item ]]" on-select-item="_onAccountListItemSelectChanged"></appsco-account-list-item>
                                    </td>

                                    <td>
                                        <div class="item-info">
                                            <span class="info-value">[[ item.display_name ]]</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div class="item-info">
                                            <span class="info-value">[[ item.email ]]</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>

                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">
                                [[ _message ]]
                            </p>
                        </template>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <div class="selected-info">
                    Selected [[ _numberOfSelectedAccounts ]] out of [[ _accountsCount ]]
                </div>
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onPromoteResourceAdminAction">Promote</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-add-resource-admin'; }

    static get properties() {
        return {
            getRolesApi: {
                type: String
            },

            getContactsApi: {
                type: String
            },

            resources: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _responseApplications: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _accountList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _accountListAll: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String
            },

            _selectedAccounts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _shareLoader: {
                type: Boolean,
                value: false
            },

            _rolesLoaded: {
                type: Boolean,
                value: false
            },

            _componentReady: {
                type: Boolean,
                value: false
            },

            _bulkSelect: {
                type: Boolean,
                value: false
            },

            _accountsCount: {
                type: Number,
                value: 0
            },

            _numberOfSelectedAccounts: {
                type: Number,
                value: 0
            },

            _filterTerm: {
                type: String,
                value: ''
            }
        };
    }

    static get observers() {
        return [
            '_setAccountList(_rolesLoaded)'
        ];
    }

    toggle() {
        this.$.dialog.toggle();
    }

    setResources(resources) {
        this.resources = resources;
    }

    _showLoader() {
        this._shareLoader = true;
    }

    _hideLoader() {
        this._shareLoader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _showAccountListProgress() {
        this.$.accountListProgress.hidden = false;
    }

    _hideAccountListProgress() {
        setTimeout(function() {
            this.$.accountListProgress.hidden = true;
        }.bind(this), 500);
    }

    _onDialogOpened() {
        this.$.appscoSearch.setup();
        this.shadowRoot.getElementById('appscoRoles').reloadItems();
        this._componentReady = true;
    }

    _onDialogClosed() {
        this._reset();
    }

    _onAccountsLoadFinished() {
        this._rolesLoaded = true;
    }

    _setAccountList(rolesLoaded) {
        const listItems = [];

        this._showAccountListProgress();

        this.set('_accountList', []);
        this.set('_accountListAll', []);

        if (rolesLoaded) {
            const rolesComponent = this.shadowRoot.getElementById('appscoRoles'),
                roles = rolesComponent.getAllItems();

            roles.forEach(function(role, index) {
                role.account.type = 'user';
                role.account.selected = false;
                listItems.push(role.account);
            }.bind(this));
        }

        this.set('_accountList', listItems);
        this.set('_accountListAll', listItems);
        this._accountsCount = this._accountList.length;
        this._hideAccountListProgress();
    }

    _onBulkSelect() {
        this._hideError();

        if (this._componentReady) {
            this._bulkSelect = !this._bulkSelect;
            this._bulkSelect ? this._selectAllAccounts() : this._deselectAllAccounts();
        }
    }

    _selectAllAccounts() {
        const list = JSON.parse(JSON.stringify(this._accountList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = true;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = true;
                }
            }
        }

        this.set('_accountList', []);
        this.set('_accountList', list);

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfo();
    }

    _deselectAllAccounts() {
        const list = JSON.parse(JSON.stringify(this._accountList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = false;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = false;
                }
            }
        }

        this.set('_accountList', []);
        this.set('_accountList', list);

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfo();
    }

    _onAccountListItemSelectChanged(event) {
        const item = event.detail.item,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        if (!item.selected) {
            this._bulkSelect = false;
        }

        for (let j = 0; j < lengthAll; j++) {
            if (listAll[j].self === item.self) {
                listAll[j].selected = item.selected;
            }
        }

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfo();
        this._setBulkSelectStatus();
        this._hideError();
    }

    _recalculateInfo() {
        const list = this._accountListAll,
            length = list.length;

        this._numberOfSelectedAccounts = 0;

        for (let i = 0; i < length; i++) {
            if (list[i].selected) {
                this._numberOfSelectedAccounts++;
            }
        }
    }

    _setBulkSelectStatus() {
        this._bulkSelect = (this._numberOfSelectedAccounts === this._accountListAll.length);
    }

    _onSearchAccounts(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;

        this._filterTerm = searchValue;

        if (searchLength < 3) {
            this._filterTerm = '';
        }

        this._filterAccountList();
    }

    _onSearchAccountsClear() {
        this._filterTerm = '';
        this._filterAccountList();
    }

    _filterAccountList() {
        const listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            term = this._filterTerm.toLowerCase();

        this._hideMessage();
        this.set('_accountList', []);

        for(const index in listAll) {
            const account = listAll[index];
            if (
                (account.name.toLowerCase().indexOf(term) > -1) ||
                (account.email.toLowerCase().indexOf(term) > -1)
            ) {
                this.push('_accountList', account);
            }
        }

        if (0 === this._accountList.length) {
            this._showMessage('There are no accounts available according to selected filters.');
        }
    }

    _reset() {
        this.$.appscoSearch.reset();
        this.set('_accountList', []);
        this.set('_accountListAll', []);
        this.set('resources', []);
        this.set('_selectedAccounts', []);
        this._componentReady = false;
        this._rolesLoaded = false;
        this._filterTerm = '';
        this._numberOfSelectedAccounts = 0;
        this._accountsCount = 0;
        this._bulkSelect = false;
        this._hideLoader();
        this._hideError();
        this._hideMessage();
    }

    _resourcesShareFinished() {
        this.$.dialog.close();

        this.dispatchEvent(new CustomEvent('resources-shared', {
            bubbles: true,
            composed: true,
            detail: {
                resources: this._responseApplications
            }
        }));

        this.set('_selectedAccounts', []);
        this.set('_responseApplications', []);
        this._hideLoader();
    }

    _promoteAccounts(application, last) {
        const accounts = this._selectedAccounts,
            length = accounts.length - 1,
            request = document.createElement('iron-request'),
            options = {
                url: application.meta.resource_admin_assign,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };

        let body = '';

        for (let i = 0; i <= length; i++) {
            let next = (i === length) ? '' : '&';
            body += 'accounts[]=' + encodeURIComponent(accounts[i].self) + next;
        }

        options.body = body;

        request.send(options).then(function() {
            this.push('_responseApplications', request.response);

            if (last) {
                this._resourcesShareFinished();
            }
        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }

    _onPromoteResourceAdminAction() {
        const list = JSON.parse(JSON.stringify(this._accountListAll));
        let length = list.length;

        this.set('_selectedAccounts', []);
        for (let i = 0; i < length; i++) {
            if (list[i].selected) {
                this._selectedAccounts.push(list[i]);
            }
        }

        if (0 === this._selectedAccounts.length) {
            this._showError('Please select at least one user to promote to resource administrator.');
            return false;
        }

        const resources = this.resources;
        length = resources.length - 1;

        this._showLoader();

        for (let i = 0; i <= length; i++) {
            if (i === length) {
                this._promoteAccounts(resources[i], true);
                return false;
            }

            this._promoteAccounts(resources[i], false);
        }
    }

    _onInnerIronOverlay(event) {
        event.stopPropagation();
    }
}
window.customElements.define(AppscoAddResourceAdmin.is, AppscoAddResourceAdmin);
