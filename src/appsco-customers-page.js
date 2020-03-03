import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/customer/appsco-customer-details.js';
import './components/customer/appsco-customers.js';
import './auditlog/appsco-audit-log.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import './components/customer/appsco-customers-page-actions.js';
import './components/customer/appsco-add-customer.js';
import './components/customer/appsco-add-partner-admin.js';
import './components/customer/appsco-remove-customers.js';
import './components/customer/appsco-import-customers.js';
import './components/customer/appsco-import-customer-resources.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomersPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.PageMixin,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {

                --details-label: {
                    font-size: 12px;
                };
                --details-value: {
                    font-size: 14px;
                };
            }
            :host .info-header .customer-icon {
                width: 32px;
                height: 32px;
                margin-right: 5px;
            }
            :host .info-header .customer-name {
                @apply --paper-font-subhead;
                font-size: 18px;
            }
            paper-tabs {
                height: 32px;
                @apply --layout-flex-none;
            }
            .paper-tabs-pages {
                @apply --paper-tabs-pages;
            }
            .tab-content {
                @apply --paper-tabs-content-style;
            }
            :host([screen992]) {
                --account-basic-info: {
                    width: 140px;
                };
                --account-basic-info-values: {
                    width: 140px;
                };

                --account-additional-info: {
                    width: 140px;
                };
                --account-additional-info-values: {
                    width: 140px;
                };
            }
            .customer-image {
                width: 32px;
                height: 32px;
                margin-right: 5px;
                border-radius: 50%;
                background-color: var(--body-background-color-darker);
                position: relative;
            }
            .customer-image iron-icon {
                width: 18px;
                height: 18px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
        </style>

        <iron-media-query query="(max-width: 992px)" query-matches="{{ screen992 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-customers id="appscoCustomers" type="customer" size="100" load-more="" selectable="" authorization-token="[[ authorizationToken ]]" list-api="[[ customersApi ]]" api-errors="[[ apiErrors ]]" on-list-loaded="_onCustomersLoaded" on-list-empty="_onCustomersEmptyLoad" on-item="_onCustomerAction" on-edit-item="_onEditCustomerAction" on-select-item="_onSelectCustomerAction" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange"></appsco-customers>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">

                <div class="info-header flex-horizontal">
                    <div class="customer-image">
                        <iron-icon icon="icons:social:domain"></iron-icon>
                    </div>
                    <span class="customer-name flex">[[ customer.name ]]</span>
                </div>

                <div class="info-content flex-vertical">
                    <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                        <paper-tab name="info">Info</paper-tab>
                    </paper-tabs>

                    <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                        <div name="info" class="tab-content details">
                            <appsco-customer-details customer="[[ customer ]]"></appsco-customer-details>
                        </div>

                    </neon-animated-pages>
                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="button flex" on-tap="_onEditCustomer">
                        Edit
                    </paper-button>
                </div>
            </div>
        </appsco-content>

        <appsco-add-partner-admin id="appscoAddPartnerAdmin" customers="[[ _selectedCustomers ]]" authorization-token="[[ authorizationToken ]]" get-roles-api="[[ companyRolesApi ]]" add-partner-admin-api="[[ addPartnerAdminToCustomerApi ]]" api-errors="[[ apiErrors ]]">
        </appsco-add-partner-admin>

        <appsco-import-customer-resources id="appscoImportCustomerResources" authorization-token="[[ authorizationToken ]]" import-api="[[ _importCustomerResourcesApi ]]" domain="[[ domain ]]" on-import-finished="_onCustomerResourcesImportFinished" disable-upgrade\$="[[!_applicationsApi]]">
        </appsco-import-customer-resources>

        <appsco-add-customer id="appscoAddCustomer" authorization-token="[[ authorizationToken ]]" customers-api="[[ customersApi ]]" company-convert-to-customer-api="[[ convertToCustomerApi ]]" roles-api="[[ companyRolesApi ]]" check-if-customer-exists-api="[[ checkIfCustomerExistsApi ]]" api-errors="[[ apiErrors ]]" on-customer-added="_onCustomerAdded">
        </appsco-add-customer>

        <appsco-remove-customers id="appscoCustomersRemove" customers="[[ _selectedCustomers ]]" customers-api="[[ customersApi ]]" authorization-token="[[ authorizationToken ]]" on-customers-removed="_onRemovedCustomers" on-customers-remove-failed="_onRemovedCustomersFailed">
        </appsco-remove-customers>

        <appsco-import-customers id="appscoImportCustomers" authorization-token="[[ authorizationToken ]]" import-api="[[ customersImportApi ]]" domain="[[ domain ]]" on-import-finished="_onCustomersImportFinished">
        </appsco-import-customers>
`;
    }

    static get is() { return 'appsco-customers-page'; }

    static get properties() {
        return {
            customer: {
                type: Object,
                value: function () {
                    return {}
                },
                observer: '_onCustomerChanged'
            },

            customersApi: {
                type: String
            },

            customersExportApi: {
                type: String
            },

            customersImportApi: {
                type: String
            },

            convertToCustomerApi: {
                type: String
            },

            companyRolesApi: {
                type: String
            },

            checkIfCustomerExistsApi: {
                type: String
            },

            addPartnerAdminToCustomerApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _customerLogApi: {
                type: String,
                computed: '_computeCustomerLogApi(customer)'
            },

            domain: {
                type: String
            },

            _selectedTab: {
                type: Number
            },

            _selectedCustomers: {
                type: Array,
                value: function() {
                    return [];
                }
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _customerSelectAction: {
                type: Number,
                value: 0
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            screen992: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, screen992)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        afterNextRender(this, function() {
            this.set('_itemsComponent', this.$.appscoCustomers);
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('search', this._onSearchCustomersAction.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchCustomersClearAction.bind(this));
        this.toolbar.addEventListener('add-customer', this._onAddCustomerAction.bind(this));
        this.toolbar.addEventListener('remove-customers', this._onRemoveCustomersAction.bind(this));
        this.toolbar.addEventListener('add-partner-admin', this._onAddPartnerAdminToCustomersAction.bind(this));
        this.toolbar.addEventListener('select-all-customers', this._onSelectAllCustomersAction.bind(this));
        this.toolbar.addEventListener('import-customers', this._onImportCustomersAction.bind(this));
        this.toolbar.addEventListener('import-customer-resources', this._onImportCustomerResources.bind(this));
        this.toolbar.addEventListener('export-customers', this._onExportCustomersAction.bind(this));
    }

    initializePage() {
        this._setDefaultCustomer();
    }

    pageSelected() {
        this.reloadCustomers();
    }

    resetPage() {
        this.hideInfo();
        this._deselectAllItems();
        this.$.appscoCustomers.reset();
    }

    toggleInfo() {
        this.$.appscoContent.toggleSection('info');
        this._infoShown = !this._infoShown;

        if (this._infoShown) {
            this._selectedTab = 0;
        }
        else {
            this.$.appscoCustomers.deactivateItem(this.customer);
            this._setDefaultCustomer();
        }
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    filterByTerm(term) {
        this.$.appscoCustomers.filterByTerm(term);
    }

    addCustomer(customer) {
        this.$.appscoCustomers.addItems([customer]);
    }

    reloadCustomers() {
        this.$.appscoCustomers.reloadItems();
    }

    reloadCustomersInfo(customers) {
        for (let idx in customers) {
            this.$.appscoCustomers.reloadInfo(customers[idx]);
        }
    }

    removeCustomers(customers) {
        this.$.appscoCustomers.removeItems(customers);
        this._setDefaultCustomer();
        return customers.length;
    }

    _computeCustomerLogApi(customer) {
        return (customer.meta && customer.meta.customer_log) ? customer.meta.customer_log : null;
    }

    _onObservableItemListChange(event, data) {
        if(data.type === 'customers') {
            this.setObservableType('customers-page');
            this.populateItems(data.items);
        }
        event.stopPropagation();
    }

    _resetPageActions() {
        this.toolbar.resetPageActions();
    }

    _updateScreen() {
        this.updateStyles();
    }

    _setDefaultCustomer() {
        this.set('customer', this.$.appscoCustomers.getFirstItem());
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _loadLog() {
        this.$.accountLog.loadLog();
    }

    _showBulkActions() {
        this.toolbar.showBulkActions();
    }

    _hideBulkActions() {
        this.toolbar.hideBulkActions();
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
        this._selectedTab = 0;
    }

    _handleInfo(customer) {
        this.set('customer', customer);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onViewInfo(event) {
        this._handleInfo(event.detail.item);
    }

    _onCustomerChanged(customer) {
        if (customer.meta && customer.meta.log) {
            this._loadLog();
        }
    }

    _onCustomersLoaded() {
        this._onPageLoaded();
        this._setDefaultCustomer();
    }

    _onCustomersEmptyLoad() {
        this._onPageLoaded();
    }

    _onCustomerAction(event) {
        if (event.detail.item.activated) {
            this._onViewInfo(event);
        }
        else {
            this.hideInfo();
            this._setDefaultCustomer();
        }
    }

    _onSelectCustomerAction(event) {
        var customer = event.detail.item;

        clearTimeout(this._customerSelectAction);

        this._customerSelectAction = setTimeout(function() {
            if (customer.selected) {
                this._showBulkActions();
            }
            else {
                var selectedCustomer = this.$.appscoCustomers.getFirstSelectedItem();
                for (let key in selectedCustomer) {
                    return false;
                }
                this._hideBulkActions();
            }
        }.bind(this), 10);

        this._handleItemsSelectedState();
    }

    _onEditCustomerAction(event) {
        this._onEditCustomer(event.detail.item);
    }

    _onEditCustomer(customer) {
        this.dispatchEvent(new CustomEvent('edit-customer', {
            bubbles: true,
            composed: true,
            detail: {
                customer: (customer && customer.alias) ? customer : this.customer
            }
        }));
    }

    exportToCsv() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.customersExportApi,
                method: 'GET',
                handleAs: 'text',
                headers: this._headers
            };
        request.send(options).then(function(response) {
            const link = document.createElement('a');

            link.href = "data:application/octet-stream," + encodeURIComponent(response.response);
            link.setAttribute('download', 'customers.csv');
            document.body.appendChild(link);

            if (link.click) {
                link.click();
            }
            else if (document.createEvent) {
                const event = document.createEvent('MouseEvents');

                event.initEvent('click', true, true);
                link.dispatchEvent(event);
            }

            document.body.removeChild(link);
        });
    }

    getSelectedCustomers() {
        return this.$.appscoCustomers.getSelectedItems()
    }

    _searchCustomers(term) {
        this._showProgressBar();
        this.filterByTerm(term);
    }

    _onSearchCustomersAction(event) {
        this._searchCustomers(event.detail.term);
    }

    _onSearchCustomersClearAction() {
        this._searchCustomers('');
    }

    _onImportCustomerResources() {
        this.shadowRoot.getElementById('appscoImportCustomerResources').toggle();
    }

    _onAddCustomerAction() {
        this.shadowRoot.getElementById('appscoAddCustomer').open();
    }

    _onExportCustomersAction() {
        this.exportToCsv();
    }

    _onCustomerAdded(event) {
        const customer = event.detail.customer;

        this.addCustomer(customer);
        this.reloadCustomers();

        this._notify('New customer ' + customer.name + ' was successfully added.');
    }

    _onRemoveCustomersAction() {
        const selectedCustomers = this.getSelectedCustomers();

        if (selectedCustomers.length > 0) {
            this.set('_selectedCustomers', selectedCustomers);
            this.shadowRoot.getElementById('appscoCustomersRemove').toggle();
        }
        else {
            this._hideBulkActions();
        }
    }

    _onRemovedCustomers(event) {
        const customersCount = this.removeCustomers(this._selectedCustomers);

        this._hideBulkActions();
        this._notify(customersCount + ' customers were successfully removed from company.');
    }

    _onRemoveCustomersFailed() {
        this.set('_selectedCustomers', []);
        this._notify('An error occurred. Selected customers were not removed from company. Please try again.');
    }

    _onAddPartnerAdminToCustomersAction() {
        const selectedCustomers = this.getSelectedCustomers();

        if (selectedCustomers.length > 0) {
            this.set('_selectedCustomers', selectedCustomers);
            this.shadowRoot.getElementById('appscoAddPartnerAdmin').open();
            this._hideProgressBar();
        }
        else {
            this._hideBulkActions();
        }
    }

    _onSelectAllCustomersAction() {
        this.selectAllItems();
    }

    _onImportCustomersAction() {
        this.shadowRoot.getElementById('appscoImportCustomers').open();
    }

    _onCustomersImportFinished(event) {
        const response = event.detail.response;

        let message = response.numberOfCreated + ' customers created out of ' + response.total + '.'
            + ' Number of failed imports: ' + response.numberOfFailed + '.'
            + ' Number of existing companies: ' + response.numberOfExisting + '.';

        if (0 < response.numberOfCreated) {
            this.reloadCustomers();
        }

        this._notify(message, true);
    }
}
window.customElements.define(AppscoCustomersPage.is, AppscoCustomersPage);
