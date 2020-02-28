/*
`appsco-company-domains`
Contains domain list and Load More action.
Domains are loaded inside component through iron-ajax.

    <appsco-company-domains company="{}">
    </appsco-company-domains>

### Styling

`<appsco-company-domains>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-company-domains` | Mixin for the root element | `{}`
`--appsco-company-domain-item` | Mixin for item style | `{}`
`--domains-container` | Mixin for the domains container | `{}`
`--domains-progress-bar` | Mixin applied to paper-progress for domain list | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import './appsco-company-domain-item.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyDomains extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-company-domains;
            }
            .domains {
                @apply --layout-vertical;
                @apply --layout-start;
            }
            appsco-company-domain-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-company-domain-item;
            }
            .domains-container {
                width: 100%;
                position: relative;
            }
            appsco-loader {
                background-color: rgba(255, 255, 255, 0.4);
            }
            .load-more-box {
                margin-top: 10px;
                padding-top: 4px;
                position: relative;
            }
            .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            .progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            .info-total {
                margin-bottom: 10px;
            }
            .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }
            .emphasized {
                color: var(--app-danger-color);
            }
            .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
        </style>

        <div class="domains-container">

            <iron-ajax id="getDomainsApiRequest" url="[[ _domainsApiUrl ]]" headers="[[ _headers ]]" on-error="_onError" on-response="_onResponse" debounce-duration="300"></iron-ajax>

            <paper-progress id="paperProgress" class="progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_domainsEmpty ]]">

                <div class="info-total">
                    <div class="total">
                        Total verified domains: [[ _verifiedDomains ]]
                        <template is="dom-if" if="[[ _unverifiedDomains ]]">
                            <span class="total emphasized">&nbsp;([[ _unverifiedDomains ]] unverified)</span>
                        </template>
                    </div>
                </div>

                <div class="domains">
                    <template is="dom-repeat" items="{{ _domains }}">

                        <appsco-company-domain-item id="appscoDomainItem_[[ index ]]" domain="{{ item }}" domains-api="[[ domainsApi ]]" authorization-token="[[ authorizationToken ]]" preview="[[ preview ]]"></appsco-company-domain-item>

                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_domainsEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMoreDomains" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-company-domains'; }

  static get properties() {
      return {
          domainsApi: {
              type: String
          },

          /**
           * Number of items to load and present
           */
          size: {
              type: Number,
              value: 10
          },

          /**
           * Show load more button
           */
          loadMore: {
              type: Boolean,
              value: false
          },

          /**
           * Indicates if domain should be in preview mode rather then full detailed view.
           */
          preview: {
              type: Boolean,
              value: false
          },

          _loadMore: {
              type: Boolean,
              value: false
          },

          _domains: {
              type: Array,
              value: function () {
                  return [];
              },
              notify: true
          },

          _allDomains: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _domainsEmpty: {
              type: Boolean,
              value: false
          },

          _verifiedDomains: {
              type: Number,
              value: 0
          },

          _unverifiedDomains: {
              type: Number,
              value: 0
          },

          _message: {
              type: String,
              value: ''
          },

          _domainsApiUrl: {
              type: String,
              computed: '_computeDomainsApiUrl(domainsApi, size)',
              observer: '_onDomainsApiUrlChanged'
          },

          _next: {
              type: String
          },

          _totalDomains: {
              type: Number,
              value: 0
          },

          _renderedIndex: {
              type: Number,
              value: -1
          },

          animationConfig: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': {
              name: 'cascaded-animation',
              animation: 'slide-from-left-animation',
              nodes: [],
              nodeDelay: 50,
              timing: {
                  duration: 300
              }
          }
      };
  }

  _computeDomainsApiUrl(domainsApi, size) {
      return (domainsApi && size) ? (domainsApi + '&page=1&limit=' + size) : null;
  }

  _setLoadMoreAction() {
      this._loadMore = (this.loadMore && this._allDomains.length < this._totalDomains);
  }

  _hideLoadMoreAction() {
      this._loadMore = false;
  }

  _onDomainsApiUrlChanged(url) {
      if (url && url.length > 0) {
          this._loadDomains();
      }
  }

  _loadDomains() {
      this._showProgressBar();
      this._loadMore = false;
      this.set('_domains', []);
      this.set('_allDomains', []);
      this.$.getDomainsApiRequest.generateRequest();
  }

  reloadDomains() {
      this._loadDomains();
  }

  _loadMoreDomains() {
      this._showLoadMoreProgressBar();
      this.$.getDomainsApiRequest.url = this._next;
      this.$.getDomainsApiRequest.generateRequest();
  }

  _onError() {
      this._message = 'We couldn\'t load domains at the moment. Please try again in a minute.';
      this._handleEmptyLoad();
  }

  _handleEmptyLoad() {
      this._domainsEmpty = true;
      this._message = 'There are no domains added.';

      this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));

      this._hideProgressBar();
      this._hideLoadMoreProgressBar();
  }

  _onResponse(event) {
      var response = event.detail.response,
          domains = response.domains,
          meta = response.meta,
          verifiedCount = response.verified,
          domainsCount = domains.length - 1;

      this._totalDomains = meta.total;
      this._verifiedDomains = verifiedCount;
      this._unverifiedDomains = this._totalDomains - verifiedCount;
      this._next = meta.next + "&limit=" + this.size;

      if (meta.total === 0) {
          this._handleEmptyLoad();
          return false;
      }

      this._domainsEmpty = false;
      this._message = '';

      domains.forEach(function(el, index) {
          setTimeout( function() {
              this.push('_domains', el);
              this.push('_allDomains', el);

              if (index === domainsCount) {

                  this._loadMore = this.loadMore;

                  if (this._domains.length === meta.total) {
                      this._loadMore = false;
                  }

                  this._hideProgressBar();
                  this._hideLoadMoreProgressBar();
                  this._setLoadMoreAction();

                  this.dispatchEvent(new CustomEvent('loaded', {
                      bubbles: true,
                      composed: true,
                      detail: {
                          domains: domains
                      }
                  }));
              }
          }.bind(this), (index + 1) * 30 );
      }.bind(this));
  }

  addDomain(domain, respectLimit) {
      this._domainsEmpty = false;
      this._message = '';
      this._renderedIndex = 0;

      this.unshift('_domains', domain);
      this.unshift('_allDomains', domain);

      if (respectLimit && this._domains.length > this.size) {
          this.pop('_domains');
          this.pop('_allDomains');
      }

      domain.verified ? this._verifiedDomains++ : this._unverifiedDomains++;
      this._totalDomains++;
  }

  modifyDomain(domain) {
      var _domains = JSON.parse(JSON.stringify(this._domains)),
          _length = _domains.length,
          allDomains = JSON.parse(JSON.stringify(this._allDomains)),
          allLength = allDomains.length;

      for (var j = 0; j < _length; j++) {
          if (domain.alias === _domains[j].alias) {
              _domains[j] = domain;
              break;
          }
      }

      for (var k = 0; k < allLength; k++) {
          if (domain.alias === allDomains[k].alias) {
              allDomains[k] = domain;
              break;
          }
      }

      this.set('_domains', []);
      this.set('_domains', _domains);

      this.set('_allDomains', []);
      this.set('_allDomains', allDomains);

      if (domain.verified) {
          this._verifiedDomains++;
          this._unverifiedDomains--;
      }
      else {
          this._verifiedDomains--;
          this._unverifiedDomains++;
      }
  }

  removeDomain(domain) {
      var _domains = this._domains,
          _length = _domains.length,
          allDomains = this._allDomains,
          allLength = allDomains.length;

      for (var j = 0; j < _length; j++) {
          if (domain.alias === _domains[j].alias) {
              this.splice('_domains', j, 1);
              break;
          }
      }

      for (var k = 0; k < allLength; k++) {
          if (domain.alias === allDomains[k].alias) {
              this.splice('_allDomains', k, 1);
              break;
          }
      }

      domain.verified ? this._verifiedDomains-- : this._unverifiedDomains--;
      this._totalDomains--;

      if (0 === this._domains.length) {
          this._handleEmptyLoad();
      }
  }

  _showProgressBar() {
      this.shadowRoot.getElementById('paperProgress').hidden = false;
  }

  _showLoadMoreProgressBar() {
      this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
  }

  _hideProgressBar() {
      setTimeout(function() {
          this.shadowRoot.getElementById('paperProgress').hidden = true;
      }.bind(this), 300);
  }

  _hideLoadMoreProgressBar() {
      setTimeout(function () {
          this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
      }.bind(this), 300);

  }
}
window.customElements.define(AppscoCompanyDomains.is, AppscoCompanyDomains);
