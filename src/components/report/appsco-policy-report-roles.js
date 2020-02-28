import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import './appsco-policy-report-role-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoPolicyReportRoles extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-styles">
            :host {
                --appsco-list-item: {
                    @apply --appsco-compliance-report-list-item;
                };
                --appsco-list-item-activated: {
                    @apply --appsco-compliance-report-list-item-activated;
                };
            }
            :host appsco-policy-report-role-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-policy-report-role-item;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ _displayList ]]">
                <template is="dom-if" if="[[ !_listEmpty ]]">

                    <div class="list">
                        <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                            <appsco-policy-report-role-item id="appscoListItem_[[ index ]]" item="{{ item }}" type="[[ type ]]" authorization-token="[[ authorizationToken ]]" policies-report-api="[[ policiesReportApi ]]"></appsco-policy-report-role-item>
                        </template>
                    </div>
                </template>
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

  static get is() { return 'appsco-policy-report-roles'; }

  static get properties() {
      return {
          policiesReportApi: {
              type: String
          },

          _displayList: {
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return [
          '_observeItems(_listItems)'
      ];
  }

  _observeItems(items) {
      this.setObservableType('accounts');
      this.populateItems(items);
  }

  _showList() {
      this._displayList = true;
  }

  _getPoliciesReport(policy, dateFrom, dateTo) {
      return new Promise(function(resolve, reject) {
          const request = document.createElement('iron-request'),
              url = (this.policiesReportApi + '?extended=1&limit=1000' +
                  (policy.policy ? ('&policy=' + policy.policy) : '') +
                  (dateFrom ? ('&from=' + dateFrom) : '') +
                  (dateTo ? ('&to=' + dateTo) : '')),
              options = {
                  url: url,
                  method: 'GET',
                  handleAs: 'json',
                  headers: this._headers
              };

          request.send(options).then(function() {
              if (200 === request.status) {
                  resolve(request.response.logs);
              }
          }.bind(this), function() {
              reject(request.response.message);
          });
      }.bind(this));
  }

  filterRoles(filters) {
      const filterTerm = filters.term ? filters.term : '',
          filterPolicy = filters.policy ? filters.policy : null,
          filterDateFrom = filters.dateFrom ? filters.dateFrom : '',
          filterDateTo = filters.dateTo ? filters.dateTo : '',
          allListItems = JSON.parse(JSON.stringify(this._allListItems)),
          allLength = allListItems.length,
          filterTermLength = filterTerm.length;

      if (filterTerm && !filterPolicy && !filterDateFrom && !filterDateTo) {
          this.filterByTerm(filterTerm);
      }
      else {

          this._getPoliciesReport(filterPolicy, filterDateFrom, filterDateTo).then(function(policies) {
              const itemsLength = policies.length;

              if (0 === itemsLength) {
                  this._showMessage('There are no broken policies for the selected filter.');
                  this._handleEmptyLoad();
                  return false;
              }

              this._hideMessage();
              this._showProgressBar();
              this._hideLoadMoreAction();
              this._clearListLoaders();
              this.set('_listItems', []);
              this._listEmpty = false;

              if (filterTerm && 2 < filterTermLength) {
                  policies.forEach(function(policy, index) {
                      for (let j = 0; j < allLength; j++) {
                          const aItem = allListItems[j];

                          if (aItem.account.id === policy.data.account.id &&
                              (-1 < aItem.account.display_name.indexOf(filterTerm) ||
                              -1 < aItem.account.email.indexOf(filterTerm))) {
                              this.push('_listItems', aItem);
                              this._listItems = JSON.parse(JSON.stringify(this._listItems));
                          }
                      }

                      if (index === itemsLength - 1) {
                          this._hideProgressBar();
                      }

                  }.bind(this));
              }
              else {
                  policies.forEach(function(policy, index) {
                      for (let i = 0; i < allLength; i++) {
                          const currentListItem = allListItems[i];

                          if (policy.data.account.id === currentListItem.account.id) {
                              this.push('_listItems', currentListItem);
                          }
                      }

                      if (index === itemsLength - 1) {
                          this._hideProgressBar();
                      }
                  }.bind(this));
              }

              if (0 === this._listItems.length) {
                  this._showMessage('There are no broken policies with asked term.');
                  this._handleEmptyLoad();
                  return false;
              }
              else {
                  this._listItems = JSON.parse(JSON.stringify(this._removeDuplicates(this._listItems, 'self')));
              }

              this._showList();
              this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
          }.bind(this));
      }
    }

  _removeDuplicates(array, property) {
      const length = array.length,
          obj = {},
          newArray = [];

      for (let i = 0; i < length; i++) {
          if (!obj[array[i][property]]) {
              obj[array[i][property]] = array[i];
          }
      }

      for (const key in obj) {
          newArray.push(obj[key]);
      }

      return newArray;
  }
}
window.customElements.define(AppscoPolicyReportRoles.is, AppscoPolicyReportRoles);
