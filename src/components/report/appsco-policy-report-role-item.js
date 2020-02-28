import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../account/appsco-account-image.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import './appsco-policies-report-breached-policy-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoPolicyReportRoleItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles"></style>

        <style>
            :host {
                --appsco-policies-report-breached-policy-item: {
                    width: calc(100% / 3);
                    margin-bottom: 15px;
                    padding-right: 20px;
                    box-sizing: border-box;
                };
            }
            appsco-account-image {
                --account-initials-background-color: var(--report-account-initials-background-color);
            }
            iron-collapse {
                @apply --shadow-elevation-2dp;
            }
            .resources-container {
                padding: 20px;
                @apply --layout-vertical;
                @apply --layout-center;
                background-color: var(--collapsible-content-background-color);
            }
            .resource-list {
                width: 100%;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-wrap;
            }
            .message {
                @apply --info-message;
            }
            :host([screen1300]) {
                --appsco-policies-report-breached-policy-item: {
                    width: 49%;
                    margin-left: 1%;
                    margin-bottom: 15px;
                    padding-right: 20px;
                    box-sizing: border-box;
                };
            }
            :host([screen800]) {
                --appsco-policies-report-breached-policy-item: {
                    width: 100%;
                    padding-right: 0;
                    margin-bottom: 15px;
                    box-sizing: border-box;
                };
            }
        </style>

        <iron-ajax id="getPoliciesApiRequest" url="[[ _getPoliciesApiUrl ]]" headers="[[ _headers ]]" auto="" on-error="_onGetPoliciesError" on-response="_onGetPoliciesResponse"></iron-ajax>

        <iron-media-query query="(max-width: 1300px)" query-matches="{{ screen1300 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ screen800}}"></iron-media-query>

        <div class="item">
            <appsco-account-image account="[[ item.account ]]"></appsco-account-image>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.account.display_name ]]</span>
                <span class="info-value">[[ item.account.email ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Number of policies breached / broken:&nbsp;</span>
                    <span class="info-value">[[ _policiesCount ]]</span>
                </div>
            </div>

            <div class="actions">
                <paper-button on-tap="_onShowResources" hidden\$="[[ _policiesVisible ]]">Show</paper-button>
                <paper-button on-tap="_onHideResources" hidden\$="[[ !_policiesVisible ]]">Hide</paper-button>
            </div>
        </div>

        <iron-collapse id="resources">
            <div class="resources-container">

                <div class="resource-list">
                    <template is="dom-repeat" items="[[ _policies ]]" rendered-item-count="{{ renderedCount }}">
                        <appsco-policies-report-breached-policy-item item="[[ item ]]"></appsco-policies-report-breached-policy-item>
                    </template>

                    <template is="dom-if" if="{{ !renderedCount }}">
                        <p class="message">There are no breached policies for this [[ type ]].</p>
                    </template>
                </div>
            </div>
        </iron-collapse>
`;
  }

  static get is() { return 'appsco-policy-report-role-item'; }

  static get properties() {
      return {
          policiesReportApi: {
              type: String
          },

          screen800: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          screen1300: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          _policies: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _getPoliciesApiUrl: {
              type: String,
              computed: '_computeGetPoliciesApiUrl(item, policiesReportApi)'
          },

          _policiesCount: {
              type: Number,
              value: 0
          },

          _policiesLoaded: {
              type: Boolean,
              value: false
          },

          _policiesVisible: {
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(screen800, screen1300)',
          '_checkStatus(_policiesLoaded)'
      ];
  }

  connectedCallback() {
      super.connectedCallback();

      afterNextRender(this, function() {
          this._checkStatus(this._policiesLoaded);
      });
  }

  _checkStatus(policiesLoaded) {
      if (!this.noAutoDisplay && policiesLoaded) {
          this._showItem();
      }
  }

  getPolicies() {
      return this._policies;
  }

  _computeGetPoliciesApiUrl(item, policiesReportApi) {
      return policiesReportApi ? (policiesReportApi + '?extended=1&limit=1000&account=' + encodeURIComponent(item.account.self)) : null;
  }

  _updateScreen() {
      this.updateStyles();
  }

  _setApiRequestUrl(url) {
      this.$.getPoliciesApiRequest.url = url;
  }

  _onGetPoliciesError() {
      this.set('_policies', []);
      this._policiesCount = 0;
      this._policiesLoaded = true;
  }

  _onGetPoliciesResponse(event) {
      const response = event.detail.response;

      if (response && response.logs) {
          const policies = response.logs;

          this._policiesCount = response.count ? response.count : 0;

          policies.forEach(function(el, index) {
              setTimeout(function() {
                  this.push('_policies', el);
              }.bind(this), (index + 1) * 30 );

          }.bind(this));

          this._policiesLoaded = true;
      }
  }

  _onShowResources() {
      this.$.resources.show();
      this._policiesVisible = true;
  }

  _onHideResources() {
      this.$.resources.hide();
      this._policiesVisible = false;
  }
}
window.customElements.define(AppscoPolicyReportRoleItem.is, AppscoPolicyReportRoleItem);
