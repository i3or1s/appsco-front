import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAddCustomer extends mixinBehaviors([Appsco.HeadersMixin, NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;

                --iron-icon-fill-color: var(--primary-text-color);

                --appsco-search-label: {
                    font-size: 16px;
                    line-height: 24px;
                };
                --appsco-search-input: {
                    font-size: 16px;
                    line-height: 24px;
                };
                --appsco-search-input-container: {
                    padding: 8px 0;
                    line-height: 20px;
                };
                --appsco-search-input-prefix: {
                    height: 24px;
                };
                --appsco-search-input-prefix-icon: {
                    width: 20px;
                    height: 20px;
                };
                --appsco-search-input-suffix: {
                    width: 20px;
                    height: 20px;
                };

            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
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
            .admin-list-container {
                width: 100%;
                position: relative;
                z-index: 5;
                display: none;
            }
            .dropdown-content {
                @apply --shadow-elevation-2dp;
                width: 99.8%;
                border-radius: 2px;
                padding: 0;
                max-height: 200px;
                overflow-y: auto;
                position: absolute;
                top: -7px;
                left: 0;
            }
            .paper-item {
                padding: 0 8px;
                height: 36px;
                line-height: 18px;
                font-size: 14px;
                cursor: pointer;
            }
            .paper-item:hover {
                @apply --paper-item-hover;
            }
            :host .info-box {
                @apply --info-box;
            }
            .or-separator {
                padding-top: 40px;
            }
            .or-separator span {
                font-weight: inherit;
                font-size: 14px;
            }
        </style>

        <iron-ajax id="getRolesApiRequest" url="[[ _rolesApi ]]" headers="[[ _headers ]]" on-error="_onRolesError" on-response="_onRolesResponse"></iron-ajax>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add new customer</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <div class="dialog-container">

                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                <template is="dom-if" if="[[ _infoShown ]]">
                    <div class="info-box">
                        Customer with the same name already exists.
                        If you want to add it anyway please continue.
                    </div>
                </template>

                <div>
                    <p>You can add an existing AppsCo Business as a customer by using the partner transfer token they provide you with, or you can create a new AppsCo Business and automatically add your company as a partner. </p>
                </div>

                <iron-form id="formCustomerNew" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                    <form method="POST" action="[[ customersApi ]]">

                        <div class="input-container">
                            <paper-input id="name" label="Customer name" name="company_customer[name]" value="{{ _customerName }}" required="" auto-validate="" on-keyup="_onFormCustomerNewFocus" error-message="Please enter customer's name." on-value-changed="_onNameInputValueChanged"></paper-input>
                        </div>

                        <div class="input-container">
                            <paper-input id="email" type="email" label="Contact e-mail" name="company_customer[contactEmail]" required="" auto-validate="" on-keyup="_onFormCustomerNewFocus" error-message="Please enter valid contact e-mail."></paper-input>
                        </div>

                        <div id="searchAdminsContainer" class="input-container">
                            <appsco-search id="appscoSearchAdmins" label="Partner administrator" float-label="" on-focus="_onAdminSearchFocusAction" on-keyup="_onAdminSearchKeyupAction" on-value-changed="_onAdminValueChangedAction" on-search="_onAdminSearchAction" on-search-clear="_onAdminSearchClearAction"></appsco-search>

                            <div id="adminListContainer" class="admin-list-container">

                                <paper-listbox id="adminList" class="dropdown-content" selected="[[ _selectedAdministrator.value ]]" attr-for-selected="value" on-iron-activate="_onAdminSelected" on-iron-overlay-closed="_onListboxClosed">

                                    <template is="dom-repeat" items="[[ _administratorsToDisplay ]]">
                                        <paper-item class="paper-item" name="[[ item.account.name ]]" value="[[ item.self ]]">
                                            [[ item.account.name ]]
                                            <paper-ripple></paper-ripple>
                                        </paper-item>
                                    </template>

                                </paper-listbox>

                            </div>
                        </div>
                    </form>
                </iron-form>

                <div class="or-separator"><span>or</span></div>

                <iron-form id="formCustomerConvert" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormTokenPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                    <form method="POST" action="[[ companyConvertToCustomerApi ]]">

                        <paper-input id="customerToken" label="Customer token" name="customer_convert[token]" value="" required="" auto-validate="" on-keyup="_onFormCustomerConvertFocus" error-message="Please enter customer's token."></paper-input>
                    </form>
                </iron-form>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAddAction">Add</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys target="[[ _formCustomerNew ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
        <iron-a11y-keys target="[[ _formCustomerConvert ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-add-customer'; }

    static get properties() {
        return {
            customersApi: {
                type: String
            },

            companyConvertToCustomerApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            rolesApi: {
                type: String
            },

            checkIfCustomerExistsApi: {
                type: String
            },

            _rolesApi: {
                type: String,
                computed: '_computeRolesApi(rolesApi)'
            },

            _administrators: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _administratorsToDisplay: {
                type: Array,
                value: function () {
                    return []
                }
            },

            _selectedAdministrator: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onSelectedAdministratorChanged'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _customerName: {
                type: String,
                value: '',
                observer: '_onCustomerNameChanged'
            },

            _customerToken: {
                type: String,
                value: ''
            },

            _formCustomerConvertActive: {
                type: Boolean,
                value: true
            },

            /**
             * Target for iron-a11y-keys component.
             * Submit formCustomerNew on enter.
             */
            _formCustomerNew: {
                type: Object
            },

            /**
             * Target for iron-a11y-keys component.
             * Submit formCustomerConvert on enter.
             */
            _formCustomerConvert: {
                type: Object
            },

            animationConfig: {
                value: function () {
                    return {

                    }
                }
            }
        };
    }

    ready() {
        super.ready();

        this._formCustomerNew = this.$.formCustomerNew;
        this._formCustomerConvert = this.$.formCustomerConvert;

        this.animationConfig = {
            'entry': {
                name: 'scale-up-animation',
                axis: 'y',
                transformOrigin: '0 0',
                node: this.shadowRoot.getElementById('adminListContainer'),
                timing: {
                    delay: 50,
                    duration: 200
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.shadowRoot.getElementById('adminListContainer'),
                timing: {
                    duration: 100
                }
            }
        };

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
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

    _showInfo() {
        this._infoShown = true;
    }

    _hideInfo() {
        this._infoShown = false;
    }

    _isInPath(path, element) {
        path = path || [];

        for (let i = 0; i < path.length; i++) {
            if (path[i] == element) {
                return true;
            }
        }

        return false;
    }

    _handleDocumentClick(event) {
        const path = dom(event).path;

        if (!this._isInPath(path, this.shadowRoot.getElementById('searchAdminsContainer'))) {
            this._hideAdminList();
        }
    }

    _computeRolesApi(rolesApi) {
        return rolesApi ? (rolesApi + '?limit=100&extended=1') : null;
    }

    _loadRoles() {
        this.set('_administrators', []);
        this.$.getRolesApiRequest.generateRequest();
    }

    _onFormCustomerConvertFocus() {
        this._formCustomerConvertActive = true;

        this.$.name.disabled = true;
        this.$.email.disabled = true;
        this.$.appscoSearchAdmins.disableAppscoSearchInput();
        this.$.customerToken.disabled = false;
    }

    _onFormCustomerNewFocus() {
        this._formCustomerConvertActive = false;

        this.$.name.disabled = false;
        this.$.email.disabled = false;
        this.$.appscoSearchAdmins.disabled = false;
        this.$.customerToken.disabled = true;
    }

    _focusFirstAdmin() {
        this.shadowRoot.getElementById('adminList').items[0].focus();
    }

    _setAppscoSearchValue(value) {
        this.$.appscoSearchAdmins.setValue(value);
    }

    _onDialogOpened() {
        this._loadRoles();
        gestures.add(this, 'tap', this._handleDocumentClick.bind(this));
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this._hideInfo();
        this._formCustomerNew.reset();
        this._formCustomerConvert.reset();
        this.set('_administrators', []);
        this.set('_administratorsToDisplay', []);
        this.set('_selectedAdministrator', {});
        this._hideAdminList();
        this.$.appscoSearchAdmins.reset();
        this._customerName = '';
        this._enableAllFormFields();
        gestures.remove(this, 'tap', this._handleDocumentClick.bind(this));
    }

    _enableAllFormFields() {
        this.$.name.disabled = false;
        this.$.email.disabled = false;
        this.$.appscoSearchAdmins.enableAppscoSearchInput();
        this.$.customerToken.disabled = false;
    }

    _onCustomerNameChanged(name) {
        if (!name) {
            this._hideInfo();
        }
    }

    _onNameInputValueChanged(event) {
        const name = event.detail.value;

        if (name) {
            this.debounce('checkIfCustomerExists', function() {
                this._checkIfCustomerExists(name);
            }.bind(this), 500);
        }
    }

    _onAddAction() {
        if (this._formCustomerConvertActive) {
            this._submitFormCustomerConvert();
        } else {
            this._submitFormCustomerNew();
        }
    }

    /**
     * Submits form on ENTER key using iron-a11y-keys component.
     *
     * @private
     */
    _onEnterAction() {
        this._onAddAction();
    }

    _checkIfCustomerExists(name) {
        const request = document.createElement('iron-request'),
            options = {
                url: this.checkIfCustomerExistsApi,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers,
                body: 'form[name]=' + encodeURIComponent(name)
            };

        request.send(options).then(function() {

            if (200 === request.status) {
                this._showInfo();
            }

        }.bind(this), function() {

            if (request.response && (1503648194 === request.response.code)) {
                this._hideInfo();
            }
        }.bind(this));
    }

    _submitFormCustomerNew() {
        this._hideError();

        if (!this._selectedAdministrator.value) {
            this._showError('You have not selected partner administrator.');
            this.$.appscoSearchAdmins.focusAppscoSearchInput();
            return false;
        }

        if (this._formCustomerNew.validate()) {
            this._showLoader();
            this._formCustomerNew.submit();
        }
    }

    _submitFormCustomerConvert() {
        this._hideError();

        if (this._formCustomerConvert.validate()) {
            this._showLoader();
            this._formCustomerConvert.submit();
        }
    }

    _onFormPresubmit(event) {
        event.target.request.body['company_customer[partnerAdmin]'] = this._selectedAdministrator.value;
    }

    _onFormTokenPresubmit(event) {
        event.target.request.body['customer_convert[token]'] = this.$.customerToken.value;
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    /**
     * Called after group has been added.
     *
     * @param {Object} event
     * @private
     */
    _onFormResponse(event) {
        this.close();

        this.dispatchEvent(new CustomEvent('customer-added', {
            bubbles: true,
            composed: true,
            detail: {
                customer: event.detail.response
            }
        }));
    }

    _onRolesError() {
        this.set('_administrators', []);
        this.set('_administratorsToDisplay', []);
    }

    _onRolesResponse(event) {
        const response = event.detail.response;

        if (!response || (response && response.meta && 0 === response.meta.total)) {
            this.set('_administrators', []);
        }
        else if (response && response.company_roles) {
            this.set('_administrators', response.company_roles);
        }

        this.set('_administratorsToDisplay', this._administrators);
    }

    _onListboxClosed(event) {
        event.stopPropagation();
    }

    _onSelectedAdministratorChanged(admin) {
        for (let key in admin) {
            this._setAppscoSearchValue(admin.name);
            return false;
        }
    }

    _onAdminSelected(event) {
        let item,
            adminList = this.shadowRoot.getElementById('adminList');

        adminList.select(event.detail.selected);
        item = adminList.selectedItem;
        this._hideAdminList();
        this.set('_administratorsToDisplay', JSON.parse(JSON.stringify(this._administrators)));
        this.set('_selectedAdministrator', item);
    }

    _onAdminSearchFocusAction() {
        this._showAdminList();
    }

    _onAdminValueChangedAction() {
        this._onFormCustomerNewFocus();
    }

    _onAdminSearchKeyupAction(event) {
        this._onFormCustomerNewFocus();

        var keyCode = event.keyCode;

        if (40 === keyCode) {
            event.target.blur();
            this._focusFirstAdmin();
            return false;
        }
    }

    _onAdminSearchAction(event) {
        this._filterAdminsByTerm(event.detail.term);
    }

    _onAdminSearchClearAction() {
        this._filterAdminsByTerm('');
    }

    _filterAdminsByTerm(term) {
        const termLength = term.length,
            admins = JSON.parse(JSON.stringify(this._administrators)),
            length = admins.length;

        this.set('_administratorsToDisplay', []);

        if (3 > termLength) {
            this.set('_administratorsToDisplay', admins);
            return false;
        }

        for (let i = 0; i < length; i++) {
            const admin = admins[i];

            if (admin && 0 <= admin.account.name.toLowerCase().indexOf(term.toLowerCase())) {
                this.push('_administratorsToDisplay', admin);
            }
        }

        if (0 === this._administratorsToDisplay.length && 3 <= termLength) {
            this.push('_administratorsToDisplay', {
                account: {
                    name: 'There is no administrator with asked name.'
                },
                self: 'no_result'
            });
        }
    }

    _showAdminList() {
        this.animationConfig.entry.node.style.display = 'block';
        this.playAnimation('entry');
    }

    _hideAdminList() {
        this.playAnimation('exit', {
            hideAdminSwitcher: true
        });
    }

    _onNeonAnimationFinish(event) {
        if (event.detail.hideAdminSwitcher) {
            this.animationConfig.exit.node.style.display = 'none';
        }
    }
}
window.customElements.define(AppscoAddCustomer.is, AppscoAddCustomer);
