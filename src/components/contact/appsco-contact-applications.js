import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import './appsco-contact-application.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoContactApplications extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                color: var(--primary-text-color);
            }
            :host paper-progress {
                width: 100%;
                --paper-progress-active-color: #7baaf7;
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
            :host paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host appsco-contact-application {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-contact-application;
            }
            :host([preview]) appsco-contact-application {
                width: auto;
                margin: 0 0 5px 0;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
            }
        </style>

        <iron-ajax id="getApplicationsCall" url="[[ _computedAction ]]" headers="[[ _headers ]]" method="GET" handle-as="json" on-response="_handleResponse" on-error="_handleError">
        </iron-ajax>

        <div class="applications">
            <div class="progress">
                <paper-progress id="progress" indeterminate=""></paper-progress>
            </div>

            <template is="dom-if" if="[[ !preview ]]">
                <div class="info-total" hidden\$="[[ !_totalApplications ]]">
                    <span class="total">Total resources: [[ _totalApplications ]]</span>
                </div>
            </template>

            <div class="flex-vertical">
                <template is="dom-repeat" items="{{ _applications }}">
                    <appsco-contact-application application="[[ item ]]" assignee="[[ contact ]]" preview="[[ preview ]]" authorization-token="[[ authorizationToken ]]"></appsco-contact-application>
                </template>
            </div>
        </div>

        <template is="dom-if" if="[[ preview ]]">
            <div hidden\$="[[ !_totalApplications ]]">
                <span class="total">Total resources: [[ _totalApplications ]]</span>
            </div>
        </template>

        <template is="dom-if" if="[[ loadMore ]]">
            <paper-button on-tap="_loadMore" id="loadMore" class="load-more-button" hidden="[[ !_moreApplications ]]">Load More</paper-button>
        </template>

        <template is="dom-if" if="{{ _message }}">
            <p class="message">
                [[ _message ]]
            </p>
        </template>
`;
  }

  static get is() { return 'appsco-contact-applications'; }

  static get properties() {
      return {
          contact: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          /**
           * Number of applications to load.
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

          _moreApplications: {
              type: Boolean,
              value: true
          },

          _computedAction: {
              type: String
          },

          _applications: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _totalApplications: {
              type: Number,
              value: 0
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

  static get observers() {
      return [
          '_computeAction(contact, _nextPage, size)',
          '_onContactChanged(contact)'
      ];
  }

  ready() {
      super.ready();

      beforeNextRender(this, function() {
          this.load();
      });
  }

  _onContactChanged() {
      this.load();
  }

  _computeAction(contact, nextPage, size) {
      this._computedAction = contact.meta ? contact.meta.applications + '?page=' + nextPage + '&limit=' + size + '&extended=1' : null;
  }

  _clearList() {
      this.set('_applications', []);
      this._message = '';
      this._nextPage = 1;
      this._totalApplications = 0;
  }

  load() {
      this.$.progress.hidden = false;
      this._clearList();
      this.$.getApplicationsCall.generateRequest();
  }

  _loadMore() {
      this.$.progress.hidden = false;
      this.$.getApplicationsCall.generateRequest();
  }

  _handleError(event) {
      this._message = 'We couldn\'t load resources at the moment. Please try again in a minute. If error continues contact us.';
      this._handleEmpty();
  }

  _handleResponse(event) {
      const response = event.detail.response;

      if (!response) {
          return false;
      }

      const applications = response.applications,
          currentLength = this._applications.length,
          total = response.meta.total;

      this._totalApplications = total;

      if (applications && applications.length > 0) {
          this._nextPage += 1;

          applications.forEach(function(application, index) {
              setTimeout( function() {
                  this.push('_applications', applications[index]);

                  if (index === (applications.length - 1)) {
                      this._moreApplications = this._applications.length !== total;

                      this._hideProgressBar();
                      this.dispatchEvent(new CustomEvent('applications-loaded', { bubbles: true, composed: true }));
                  }
              }.bind(this), (index + 1) * 30 );
          }.bind(this));
      }
      else if (applications && !applications.length) {
          if (!currentLength) {
              this._message = 'There are no company resources shared with this contact.';
          }

          this._moreApplications = false;
          this._handleEmpty();
      }
      else if (!currentLength) {
          this._message = 'We couldn\'t load resources at the moment.';
          this._moreApplications = false;
          this._handleEmpty();
      }
  }

  _handleEmpty() {
      this._hideProgressBar();
      this.dispatchEvent(new CustomEvent('applications-empty', { bubbles: true, composed: true }));
  }

  _hideProgressBar() {
      setTimeout(function() {
          this.$.progress.hidden = true;
      }.bind(this), 500);
  }

  reload() {
      this._clearList();
      this.$.getApplicationsCall.generateRequest();
  }
}
window.customElements.define(AppscoContactApplications.is, AppscoContactApplications);
