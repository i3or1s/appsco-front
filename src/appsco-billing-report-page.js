import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-styles/shadow.js';
import './components/page/appsco-content.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import './components/page/appsco-page-styles.js';
import './components/customer/appsco-customers-billing.js';
import './components/components/appsco-search.js';
import './components/report/appsco-billing-report-page-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoBillingReportPage extends mixinBehaviors([NeonAnimatableBehavior, AppscoPageBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --paper-dropdown-menu: {
                    display: block;
                }
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            .filter {
                position: relative;
            }
            paper-listbox.searchable {
                @apply --shadow-elevation-2dp;
                width: 100%;
                min-height: 100px;
                max-height: calc(100vh - 2*64px - 20px - 45px - 2*54px);
                overflow-y: auto;
                position: absolute;
                top: 50px;
                left: 0;
                z-index: 10;
                opacity: 1;
                visibility: visible;
                transform: scale(1, 1);
                transform-origin: top center;
                transition: all 0.2s linear;
            }
            paper-listbox[hidden] {
                opacity: 0;
                visibility: hidden;
                transform: scale(1, 0.6);
                transform-origin: top center;
                transition: all 0.1s linear;
            }
            :host([mobile-screen]) {
                --resource-width: 0;
            }
        </style>

        <iron-media-query query="(max-width: 880px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="" on-component-ready="_onPageLoaded">
            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-header">
                    Filters
                </div>

                <div class="resource-content filters">
                    <div class="filter">
                        <appsco-search id="filterCustomers" label="Filter customers" float-label="" on-keyup="_onFilterCustomersKeyup" on-search="_onFilterCustomersSearch" on-blur="_onFilterCustomersBlur" on-search-clear="_onFilterCustomersSearchClear">
                        </appsco-search>
                        <paper-listbox id="suggestedCustomers" class="dropdown-content searchable" attr-for-selected="label" on-iron-activate="_onFilterCustomers" hidden="">
                            <template is="dom-repeat" items="{{ _customersList }}">
                                <paper-item value="[[ item.value ]]" label="[[ item.name ]]">[[ item.name ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </div>

                    <div class="filter">
                        <paper-dropdown-menu id="dropdownPaymentType" label="Filter by payment type" horizontal-align="left">
                            <paper-listbox id="paymentType" class="dropdown-content" attr-for-selected="value" on-selected-changed="_onPaymentTypeSelect" selected="" slot="dropdown-content">
                                <paper-item value="">All</paper-item>
                                <paper-item value="paid_by_partner">Paid by partner</paper-item>
                                <paper-item value="paid_by_customer_cc_monthly">Paid by customer monthly</paper-item>
                                <paper-item value="paid_by_customer_cc_yearly">Paid by customer yearly</paper-item>
                                <paper-item value="trial">Trial</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </div>

                    <div class="filter">
                        <paper-dropdown-menu id="dropdownPeriod" label="Filter by period" horizontal-align="left">
                            <paper-listbox id="period" class="dropdown-content" attr-for-selected="value" on-selected-changed="_onPeriodSelect" selected="" slot="dropdown-content">
                                <paper-item value="">All</paper-item>
                                <paper-item value="1">1 month</paper-item>
                                <paper-item value="2">2 months</paper-item>
                                <paper-item value="3">3 months</paper-item>
                                <paper-item value="6">6 months</paper-item>
                                <paper-item value="9">9 months</paper-item>
                                <paper-item value="12">12 months</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </div>

                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-customers-billing id="appscoCustomers" type="customer" load-more="" size="10000" authorization-token="[[ authorizationToken ]]" list-api="[[ billingReportApi ]]" on-list-loaded="_onCustomersLoaded" on-list-empty="_onCustomersEmptyLoad"></appsco-customers-billing>
                </div>
            </div>
        </appsco-content>
`;
    }

    static get is() { return 'appsco-billing-report-page'; }

    static get properties() {
        return {
            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            billingReportApi: {
                type: String
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            _customersList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            customersApi: {
                type: String
            },

            searchTerm: {
                type: String,
                value: ''
            },

            paymentType: {
                type: String,
                value: ''
            },

            period: {
                type: String,
                value: ''
            }
        };
    }

    static get observers(){
        return [
            '_updateScreen(mobileScreen, tabletScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
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

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.tabletScreen) {
                this.updateStyles();
            }
        });
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _updateScreen() {
        this.updateStyles();
    }

    _onCustomersLoaded() {
        this._onPageLoaded();
    }

    _onCustomersEmptyLoad() {
        this._onPageLoaded();
    }

    _onFilterCustomersKeyup() {
        this._showCustomersList();
    }

    _onFilterCustomersSearch (event) {
        this._filterCustomerListByTerm(event.detail.term)
    }

    _filterCustomerListByTerm(term) {
        this.searchTerm = term;
        this.set('_customersList', []);
        this._getCustomersByTerm().then(function(customers) {

            customers.forEach(function (element) {
                this.push('_customersList', {
                    value: element.self,
                    name: element.name
                });
            }.bind(this));

        }.bind(this));
        this.filterList();
    }

    _onFilterCustomersBlur() {
        this._hideCustomersList();
    }

    _onFilterCustomersSearchClear() {
        this.$.filterCustomers.reset();
        this.$.suggestedCustomers.selected = 0;
        this.searchTerm = '';
        this.filterList();
    }

    _onFilterCustomers(event) {
        var selected = event.detail.selected;
        this.searchTerm = selected;
        this.$.filterCustomers.setValue(selected);
        this.filterList();
        this._hideCustomersList();
    }

    _showCustomersList() {
        this.$.suggestedCustomers.hidden = false;
    }

    _hideCustomersList() {
        this.$.suggestedCustomers.hidden = true;
    }

    _onPaymentTypeSelect(event) {
        var selected = event.detail;
        if (selected) {
            this.paymentType = selected.value;
        }
        this.filterList();
    }

    _onPeriodSelect(event) {
        var selected = event.detail;
        if (selected) {
            this.period = selected.value;
        }
        this.filterList();
    }

    filterList() {
        this.$.appscoCustomers.filter(this.searchTerm, this.paymentType, this.period);
    }

    _getCustomersByTerm() {
        var apiUrl = this.customersApi + '?term=' + this.searchTerm + '&extended=true&limit=50';
        return new Promise(function(resolve, reject) {
            var request = document.createElement('iron-request'),
                options = {
                    url: apiUrl,
                    method: 'GET',
                    handleAs: 'json',
                    headers: {'Authorization': 'token ' + this.authorizationToken}
                };

            request.send(options).then(function() {
                if (request.response) {
                    resolve(request.response.customers);
                }
            }, function() {
                reject(request.response.message);
            });
        }.bind(this));
    }

    getFilters () {
        return {
            term: this.searchTerm,
            payment_type: this.paymentType,
            period: this.period
        };
    }

    getFailMessage() {
        return 'Export of Billing Report failed. Please contact AppsCo support.';
    }

    getFileName() {
        return 'Billing Report.xlsx';
    }

    getOnSuccessEvent() {
        return 'export-billing-report-finished';
    }

    getOnFailEvent() {
        return 'export-billing-report-failed';
    }
}
window.customElements.define(AppscoBillingReportPage.is, AppscoBillingReportPage);
