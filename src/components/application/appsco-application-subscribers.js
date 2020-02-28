/**
`appsco-application-subscribers`
Contains info about subscribers to application (accounts to whom app is shared, including owner).

    <appsco-application-subscribers>
    </appsco-application-subscribers>

### Styling

`<appsco-application-subscribers>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-application-subscribers` | Mixin for the root element | `{}`

@demo demo/appsco-application-subscribers.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import './appsco-application-subscriber.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationSubscribers extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
            @apply --layout-vertical;
            @apply --layout-center;
                position: relative;
                color: var(--primary-text-color);
            }
            :host paper-progress {
                width: 100%;
            }
            :host .progress {
                height: 6px;
            }
            :host .info-total {
                margin-bottom: 10px;
            }
            :host .total {
            @apply --paper-font-caption;
                opacity: 0.6;
            }
            :host .accounts {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                width: 100%;
            }
            :host .load-more-box {
                margin-top: 10px;
                padding-top: 4px;
                position: relative;
            }
            :host .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            :host .load-more-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
            @apply --load-more-button;
            }
            :host .message {
                width: 100%;
                color: var(--secondary-text-color);
                font-style: italic;
            @apply --paper-font-body2;
            @apply --info-message;
            }
            :host appsco-application-subscriber {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-application-subscriber;
            }
            :host([preview]) {
                @apply --layout-flex-none;
                display: block;
            }
            :host([preview]) appsco-application-subscriber {
                width: auto;
                margin: 0 2px 0 0;
                @apply --appsco-application-subscriber-preview;
            }
        </style>

        <iron-ajax id="getSubscribersCall" url="[[ _computedAction ]]" headers="[[ _headers ]]" method="GET" handle-as="json" on-response="_handleResponse" on-error="_handleError">
        </iron-ajax>

        <div class="accounts">
            <div class="progress">
                <paper-progress id="progress" indeterminate=""></paper-progress>
            </div>

            <template is="dom-if" if="[[ !preview ]]">
                <div class="info-total" hidden\$="[[ !_totalSubscribers ]]">
                    <span class="total">Total subscribers: [[ _totalSubscribers ]]</span>
                </div>
            </template>

            <template is="dom-repeat" items="[[ _accounts ]]">
                <appsco-application-subscriber application="[[ application ]]" subscriber="[[ item ]]" account="[[ account ]]" preview="[[ preview ]]"></appsco-application-subscriber>
            </template>
        </div>

        <template is="dom-if" if="[[ preview ]]">
            <div hidden\$="[[ !_totalSubscribers ]]">
                <span class="total">Total subscribers: [[ _totalSubscribers ]]</span>
            </div>
        </template>

        <template is="dom-if" if="[[ loadMore ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMoreSubscribers" id="loadMore" class="load-more-button">Load More</paper-button>
            </div>
        </template>

        <template is="dom-if" if="{{ _message }}">
            <p class="message">
                [[ _message ]]
            </p>
        </template>
`;
  }

  static get is() { return 'appsco-application-subscribers'; }

  static get properties() {
      return {
          /**
           * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
           */
          application: {
              type: Object,
              value: function () {
                  return {};
              },
              observer: '_onApplicationChanged'
          },

          account: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          /**
           * Number of accounts to load and present
           */
          size: {
              type: Number,
              value: 5
          },

          loadMore: {
              type: Boolean,
              value: false
          },

          preview: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          _nextPage: {
              type: Number,
              value: 1
          },

          /**
           * Computed action.
           */
          _computedAction: {
              type: String
          },

          _searchAccountsApi: {
              type: String,
              computed: '_computeSearchAccountsApi(application)'
          },

          /**
           * [Accounts](https://developers.appsco.com/api/accounts/id) that is to be rendered
           */
          _accounts: {
              type: Array,
              value: function () {
                  return [];
              },
              notify: true
          },

          _allAccounts: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _totalSubscribers: {
              type: Number
          },

          _loadMore: {
              type: Boolean,
              value: false
          },

          _message: {
              type: String
          }
      };
  }

  ready() {
      super.ready();

      this._computedAction = this.application.meta ? this.application.meta.subscribers + '?page=1' + '&limit=' + this.size + '&extended=1' : null;

      beforeNextRender(this, function() {
          this.load();
      });
  }

  _computeAction() {
      this._computedAction = this.application.meta ? this.application.meta.subscribers + '?page=' + this._nextPage + '&limit=' + this.size + '&extended=1' : null;
  }

  _computeSearchAccountsApi(application) {
      return application.meta ? application.meta.subscribers + '?page=1&limit=100&extended=1' : null;
  }

  _showLoadMoreAction() {
      this._loadMore = true;
  }

  _hideLoadMoreAction() {
      this._loadMore = false;
  }

  _setLoadMoreAction() {
      this._allAccounts.length < this._totalSubscribers ? this._showLoadMoreAction() : this._hideLoadMoreAction();
  }

  _showLoadMoreProgressBar() {
      this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
  }

  _hideLoadMoreProgressBar() {
      setTimeout(function() {
          if (this.shadowRoot.getElementById('loadMoreProgress')) {
              this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
          }
      }.bind(this), 300);

  }

  _hideProgressBar() {
      setTimeout(function() {
          this.$.progress.hidden = true;
      }.bind(this), 500);

  }

  _onApplicationChanged(application, applicationOld) {
      if (application && applicationOld && application.self !== applicationOld.self) {
          this._computedAction = application.meta ? application.meta.subscribers + '?page=1' + '&limit=' + this.size + '&extended=1' : null;
          this.load();
      }
  }

  load() {
      if (this.application.owner) {
          this.$.progress.hidden = false;
          this.set('_accounts', []);
          this.set('_allAccounts', []);
          this._message = '';
          this._nextPage = 1;

          this.$.getSubscribersCall.generateRequest();
      }
  }

  _loadMoreSubscribers() {
      this._showLoadMoreProgressBar();
      this._computeAction();
      this.$.getSubscribersCall.generateRequest();
  }

  _handleEmpty() {
      this._hideProgressBar();
      this._hideLoadMoreProgressBar();
      this.dispatchEvent(new CustomEvent('subscribers-empty', { bubbles: true, composed: true }));
  }

  _handleError(event) {
      this._message = 'We couldn\'t load subscribers at the moment. Please try again in a minute. If error continues contact us.';
      this._totalSubscribers = 0;
      this._handleEmpty();
  }

  _handleResponse(event) {
      const response = event.detail.response;

      if (!response) {
          this._hideProgressBar();
          this._hideLoadMoreProgressBar();
          return false;
      }

      const accounts = response.accounts,
          currentLength = this._accounts.length,
          total = response.meta.total;

      if (!this._loadMore) {
          this.set('_accounts', []);
          this.set('_allAccounts', []);
      }

      this._hideLoadMoreAction();

      this._totalSubscribers = total;

      if (accounts && accounts.length > 0) {
          this._nextPage += 1;

          accounts.forEach(function(account, index) {
              setTimeout( function() {
                  this.push('_accounts', account);
                  this.push('_allAccounts', account);

                  if (index === (accounts.length - 1)) {
                      this._hideProgressBar();
                      this._hideLoadMoreProgressBar();
                      this._setLoadMoreAction();
                      this.dispatchEvent(new CustomEvent('subscribers-loaded', { bubbles: true, composed: true }));
                  }
              }.bind(this), (index + 1) * 30 );
          }.bind(this));
      }
      else if (accounts && !accounts.length) {
          if (!currentLength) {
              this._message = 'You haven\'t shared this resource to anyone yet.';
          }

          this._hideLoadMoreAction();
          this._handleEmpty();
      }
      else if (!currentLength) {
          this._message = 'We couldn\'t load subscribers at the moment.';
          this._hideLoadMoreAction();
          this._handleEmpty();
      }
  }

  _searchAccounts(term) {
      return new Promise(function(resolve, reject) {
          const request = document.createElement('iron-request'),
              options = {
                  url: this._searchAccountsApi + '&term=' + term,
                  method: 'GET',
                  handleAs: 'json',
                  headers: this._headers
              };

          request.send(options).then(function() {
              if (request.response) {
                  resolve(request.response.accounts);
              }

          }, function() {
              if (request.response) {
                  reject(request.response.message);
              }
              else {
                  reject('There was an error in searching subscribers with given term. Please contact AppsCo support.');
              }
          });
      }.bind(this));
  }

  search(term) {
      if (term.length < 3) {
          this._message = '';
          this.set('_accounts', JSON.parse(JSON.stringify(this._allAccounts)));
          this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
          this._setLoadMoreAction();
          return false;
      }

      this._searchAccounts(term).then(function(accounts) {
          this._hideLoadMoreAction();
          this.set('_accounts', []);

          if (accounts.length > 0) {
              this._message = '';

              accounts.forEach(function(account, index) {
                  this.push('_accounts', account);

                  if (index === (accounts.length - 1)) {
                      this._hideProgressBar();
                      this.dispatchEvent(new CustomEvent('subscribers-loaded', { bubbles: true, composed: true }));
                  }
              }.bind(this));
          }
          else {
              this._message = 'There are no subscribers with asked term.';
          }
      }.bind(this), function(message) {
          this.set('_accounts', []);
          this._hideLoadMoreAction();
          this._message = message;
      }.bind(this));
  }
}
window.customElements.define(AppscoApplicationSubscribers.is, AppscoApplicationSubscribers);
