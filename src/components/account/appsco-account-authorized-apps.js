/**
`appsco-account-authorized-apps`
Is used to present account's authorized apps.

Example:

    <body>
        <appsco-account-authorized-apps account="{}"
                                       authorization-token=""
                                       size=""
                                       load-more
                                       short-view>
        </appsco-account-authorized-apps>

 Custom property | Description | Default
----------------|-------------|----------
`--account-authorized-apps` | Mixin applied to root element | `{}`
`--account-authorized-apps-container` | Mixin applied to inner authorized apps container element | `{}`
`--account-authorized-apps-paper-progress` | Mixin applied to paper-progress | `{}`
`--account-authorized-app` | Mixin applied to inner appsco-account-authorized-app element | `{}`
`--account-authorized-app-first` | Mixin applied to inner appsco-account-authorized-app first element | `{}`
`--load-more-button` | Mixin applied to Load More button | `{}`

@demo demo/appsco-account-authorized-apps.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-button/paper-button.js';
import './appsco-account-authorized-app.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountAuthorizedApps extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                width: 100%;
            @apply --account-authorized-apps;
            }
            .authorized-apps {
                padding-top: 10px;
                position: relative;
            @apply --layout-vertical;
            @apply --account-authorized-apps-container;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
            @apply --paper-font-body2;
            @apply --info-message;
            }
            :host paper-progress {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 100%;
                @apply --appsco-list-progress-bar;
            }
            :host appsco-account-authorized-app {
            @apply --account-authorized-app;
            }
            :host appsco-account-authorized-app:first-of-type {
            @apply --account-authorized-app-first;
            }
            :host .load-more-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
        </style>

        <iron-ajax id="ironAjaxAuthorizedApps" url="{{ _computedUrl }}" method="GET" headers="{{ _headers }}" handle-as="json" on-error="_handleError" on-response="_handleResponse">
        </iron-ajax>

        <div class="authorized-apps">

            <paper-progress id="progress" indeterminate=""></paper-progress>

            <template is="dom-repeat" items="{{ _authorizedApps }}">

                <appsco-account-authorized-app application="[[ item ]]" short-view="[[ shortView ]]"></appsco-account-authorized-app>

            </template>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>

            <paper-button id="loadMore" class="load-more-button" hidden="[[ !loadMore ]]" on-tap="_loadMore">Load More</paper-button>

        </div>
`;
  }

  static get is() { return 'appsco-account-authorized-apps'; }

  static get properties() {
      return {
          account: {
              type: Object,
              value: function () {
                  return {}
              },
              notify: true
          },

          authorizedAppsApi: {
              type: String
          },

          _nextPage: {
              type: Number,
              value: 1
          },

          /**
           * Number of authorized apps to load.
           */
          size: {
              type: Number,
              value: 5
          },

          loadMore: {
              type: Boolean,
              value: false
          },

          shortView: {
              type: Boolean,
              value: false
          },

          _computedUrl: {
              type: String,
              computed: "_computeUrl(authorizedAppsApi)"
          },

          _authorizedApps: {
              type: Array,
              value: function () {
                  return [];
              },
              notify: true
          },

          _message: {
              type: String
          }
      };
  }

  _computeUrl(authorizedAppsApi) {
      return authorizedAppsApi + '?page=' + this._nextPage + '&limit=' + this.size;
  }

  loadAuthorizedApps() {
      this.$.progress.hidden = false;
      this._authorizedApps = [];
      this._nextPage = 1;

      this.$.ironAjaxAuthorizedApps.url = this._computeUrl(this.authorizedAppsApi);
      this.$.ironAjaxAuthorizedApps.generateRequest();
  }

  _loadMore() {
      this.$.progress.hidden = false;

      this.$.ironAjaxAuthorizedApps.url = this._computeUrl(this.authorizedAppsApi);
      this.$.ironAjaxAuthorizedApps.generateRequest();
  }

  _handleError(event) {
      this._message = 'We couldn\'t load applications at the moment. Please try again in a minute. If error continues contact us.';
      this._hideProgressBar();
  }

  _handleResponse(event) {
      const response = event.detail.response,
          applications = response.authorizations,
          currentLength = this._authorizedApps.length;

      if (applications && applications.length > 0) {
          this._nextPage += 1;

          applications.forEach(function(application, i) {
              setTimeout( function() {
                  this.push('_authorizedApps', applications[i]);

                  if (i === (applications.length - 1)) {
                      this._hideProgressBar();

                      if (applications.length < this.size) {
                          this.$.loadMore.disabled = true;
                      }
                  }
              }.bind(this), (i + 1) * 30 );
          }.bind(this));
      }
      else if (applications && !applications.length) {
          if (!currentLength) {
              this._message = 'You don\'t have authorized applications.';
          }
          else {
              this.$.loadMore.disabled = true;
          }

          this._hideProgressBar();
      }
      else if (!currentLength) {
          this._message = 'We couldn\'t load applications at the moment.';
          this._hideProgressBar();
      }
  }

  _hideProgressBar() {
      setTimeout(function() {
          this.$.progress.hidden = true;
      }.bind(this), 500);
  }
}
window.customElements.define(AppscoAccountAuthorizedApps.is, AppscoAccountAuthorizedApps);
