import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-customer-billing-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomersBilling extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host appsco-customer-billing-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-customer-billing-item;
            }
            :host .total {
                width: 100%;
                margin-bottom: 5px;
                color: var(--secondary-text-color);
                font-size: 13px;
                line-height: 18px;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="total">
            <span>Total customers: <span id="numberOfCustomers">0</span></span>
        </div>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="list">
                    <template is="dom-repeat" items="[[ _items ]]" on-dom-change="_onItemsDomChange">

                        <appsco-customer-billing-item id="appscoListItem_[[ index ]]" item="[[ item ]]" billing-data="[[ item.billing_data ]]"></appsco-customer-billing-item>

                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_listEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button class="load-more-action" on-tap="_onLoadMoreAction">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-customers-billing'; }

    static get properties() {
        return {
            paymentType: {
                type: String,
                value: ''
            },

            period: {
                type: String,
                value: ''
            },

            _items: {
                type: Array,
                value: function () {
                    return []
                },
                computed: '_computeListItems(_listItems)'
            }
        };
    }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    _observeItems(items) {
        this.setObservableType('customers');
        this.populateItems(items);
    }

    filter(searchTerm, paymentType, period) {
        let filterApi = this.listApi + '?page=1&limit=1000&extended=1';

        this._hideMessage();
        this._showProgressBar();
        this._hideLoadMoreAction();
        this._clearListLoaders();
        this.set('_listItems', []);

        if (searchTerm) {
            filterApi += '&term=' + searchTerm;
        }

        if (paymentType) {
            filterApi += '&payment_type=' + paymentType;
        }

        if (period) {
            filterApi += '&period=' + period;
        }

        this._getItems(filterApi).then(function(items) {
            const itemsLength = items.length,
                allListItems = JSON.parse(JSON.stringify(this._allListItems)),
                allLength = allListItems.length;

            if (0 === itemsLength) {
                this._showMessage('There are no customers that match given parameters');
                this._handleEmptyLoad();
                this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                return false;
            }

            this._listEmpty = false;

            items.forEach(function(element, index) {
                for (let i = 0; i < allLength; i++) {
                    const currentListItem = allListItems[i];

                    if (element.alias === currentListItem.alias) {
                        this.push('_listItems', currentListItem);
                        this._listItems = JSON.parse(JSON.stringify(this._listItems));
                        break;
                    } else if (i === allLength - 1) {
                        this.push('_listItems', element);
                        this._listItems = JSON.parse(JSON.stringify(this._listItems));
                    }
                }

                if (index === itemsLength - 1) {
                    this._hideProgressBar();
                    this.dispatchEvent(new CustomEvent('filter.done', { bubbles: true, composed: true }));
                }
            }.bind(this));
        }.bind(this));
    }

    _computeListItems(listItems) {
        const groupedItems = [],
            addedCompanies = [],
            licencesSum = [],
            itemsWithLicences = [];
        listItems.forEach(function(item, index) {
            const customerIndex = addedCompanies.indexOf(item.customer.alias);
            if (customerIndex === -1) {
                const customer = item.customer;
                customer.billing_data = [];
                addedCompanies.push(item.customer.alias);
                customer.billing_data.push({month: this.getMonthName(item.month), year: item.year, used_licences: item.used_licences});
                groupedItems.push(customer);
                licencesSum.push(item.used_licences);
            } else {
                groupedItems[customerIndex].billing_data.push({month: this.getMonthName(item.month), year: item.year, used_licences: item.used_licences});
                licencesSum [customerIndex] += item.used_licences;
            }
        }.bind(this));

        licencesSum.forEach(function(item, index) {
            itemsWithLicences.push(groupedItems[index]);
        });
        this.$.numberOfCustomers.innerHTML = itemsWithLicences.length;
        return itemsWithLicences;
    }

    getMonthName(month) {
        let name = '';
        switch(month) {
            case 1:
                name = 'January';
                break;
            case 2:
                name = 'February';
                break;
            case 3:
                name = 'March';
                break;
            case 4:
                name = 'April';
                break;
            case 5:
                name = 'May';
                break;
            case 6:
                name = 'June';
                break;
            case 7:
                name = 'July';
                break;
            case 8:
                name = 'August';
                break;
            case 9:
                name = 'September';
                break;
            case 10:
                name = 'October';
                break;
            case 11:
                name = 'November';
                break;
            case 12:
                name = 'December';
                break;
        }
        return name;
    }
}
window.customElements.define(AppscoCustomersBilling.is, AppscoCustomersBilling);
