import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import './components/policy/appsco-policies.js';
import './components/policy/appsco-policy-info.js';
import './components/policy/appsco-policy-settings.js';
import './components/policy/appsco-policies-page-actions.js';
import './components/policy/appsco-change-policy-status.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoPoliciesPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-page-styles">
            :host {
                --item-basic-info: {
                    padding: 0 10px;
                };
            }
            :host div[resource] > .resource-content {
                padding-top: 20px;
            }
            paper-tabs {
                height: 32px;
                @apply --layout-flex-none;
            }
            .paper-tabs-pages {
                @apply --paper-tabs-pages;
            }
            .tab-content {
                margin-top: 20px;
                @apply --paper-tabs-content-style;
            }
            :host .info {
                @apply --info-message;
                margin-top: 0;
                margin-bottom: 10px;
            }
            :host .info-actions > .enable-button {
                margin-right: 1px;
            }
            :host([mobile-screen]) {
                --resource-width: 100%;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-header">
                    Policy
                </div>

                <div class="resource-content">
                    <p class="info">
                        Policies can assist in decision making. Policies can be enforced and informational only.
                    </p>
                    <p class="info">
                        Policies which are informational can assist management in decisions
                        which are relative to a number of factors and are usually hard to test objectively,
                        e.g. are users logging in from company or outside.
                        In enforced policies we can enforce the certain rules onto users, e.g. must use two-factor authentication.
                        Note that policies can only be enforced to the managed users.
                    </p>
                    <p class="info">
                        Policies can be setup to obtain more insight into daily operations inside a company, or tight up your access and security.
                    </p>
                    <p class="info">
                        If there are any policies which you would like to implement and are not present on this list, do not hesitate to contact us.
                    </p>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-policies id="appscoPolicies" name="policies" type="policy" size="100" load-more="" authorization-token="[[ authorizationToken ]]" list-api="[[ companyPoliciesApi ]]" on-list-loaded="_onPoliciesLoaded" on-list-empty="_onPoliciesEmptyLoad" on-item="_onPolicyAction" on-edit-item="_onEditPolicyAction" on-enable-policy="_onEnablePolicyAction" on-disable-policy="_onDisablePolicyAction" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange"></appsco-policies>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <span class="policy-name flex">[[ policy.name ]]</span>
                </div>

                <div class="info-content flex-vertical">

                    <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                        <paper-tab name="info">Info</paper-tab>
                        <paper-tab name="settings">Settings</paper-tab>
                    </paper-tabs>

                    <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                        <div name="info" class="tab-content">
                            <appsco-policy-info policy="[[ policy ]]"></appsco-policy-info>
                        </div>

                        <div name="settings" class="tab-content">
                            <appsco-policy-settings policy="[[ policy ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-policy-updated="_onPolicyUpdated">
                            </appsco-policy-settings>
                        </div>

                    </neon-animated-pages>

                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="button enable-button flex" on-tap="_onEnablePolicyAction">
                        Enable
                    </paper-button>
                    <paper-button class="button danger-button flex" on-tap="_onDisablePolicyAction">
                        Disable
                    </paper-button>
                </div>
            </div>

        </appsco-content>

        <appsco-change-policy-status id="appscoChangePolicyStatus" authorization-token="[[ authorizationToken ]]" api-errors="[[ _apiErrors ]]" on-policy-status-changed="_onPolicyStatusChanged">
        </appsco-change-policy-status>
`;
  }

  static get is() { return 'appsco-policies-page'; }

  static get properties() {
      return {
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

          animationConfig: {
              type: Object
          },

          policy: {
              type: Object,
              value: function () {
                  return {}
              }
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          companyPoliciesApi: {
              type: String
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _policyExists: {
              type: Boolean,
              computed: '_computePolicyExistence(policy)'
          },

          pageLoaded: {
              type: Boolean,
              value: false
          },

          _page: {
              type: String,
              value: 'policies'
          },

          _infoShown: {
              type: Boolean,
              value: false
          },

          _selectedTab: {
              type: Number
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(mobileScreen, tabletScreen)'
      ];
  }

  pageSelected() {}

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
          if (this.mobileScreen) {
              this.updateStyles();
          }
      });
  }

  initializePage() {
      this._setDefaultPolicy();
  }

  resetPage() {
      this._resetPageLists();
      this.hideInfo();
  }

  hideResource() {
      this.$.appscoContent.hideSection('resource');
  }

  showPage(page) {
      this._page = page;
  }

  toggleInfo() {
      if (this._policyExists) {
          this.$.appscoContent.toggleSection('info');
          this._infoShown = !this._infoShown;

          if (this._infoShown) {
              this._selectedTab = 0;
          }
          else {
              this.$.appscoPolicies.deactivateItem(this.policy);
              this._setDefaultPolicy();
          }
      }
  }

  hideInfo() {
      this.$.appscoContent.hideSection('info');
      this._infoShown = false;
  }

  toggleResource() {
      this.$.appscoContent.toggleSection('resource');
  }

  modifyPolicy(policy) {
      this.set('policy', {});
      this.set('policy', policy);
  }

  modifyPolicies(policies) {
      this.$.appscoPolicies.modifyItems(policies);
  }

  _onObservableItemListChange(event, data) {
      if (data.type === this._page) {
          this.setObservableType('policies-page');
          this.populateItems(data.items);
      }

      event.stopPropagation();
  }

  _setDefaultPolicy() {
      this.set('policy', this.$.appscoPolicies.getFirstItem());
  }

  _resetPageLists() {
      this.$.appscoPolicies.reset();
  }

  _computePolicyExistence(policy) {
      for (const key in policy) {
          return true;
      }

      return false;
  }

  _updateScreen() {
      this.updateStyles();
  }

  _onPoliciesLoaded() {
      this._onPageLoaded();
      this._setDefaultPolicy();
  }

  _onPoliciesEmptyLoad() {
      this._onPageLoaded();
  }

  _onPageLoaded() {
      this.pageLoaded = true;
      this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
  }

  _onPolicyAction(event) {
      if (event.detail.item.activated) {
          this._onViewInfo(event);
      }
      else {
          this.hideInfo();
          this._setDefaultPolicy();
      }
  }

  _showInfo() {
      this.$.appscoContent.showSection('info');
      this._infoShown = true;
      this._selectedTab = 0;
  }

  _handleInfo(policy) {
      this.set('policy', policy);

      if (!this._infoShown) {
          this._showInfo();
      }
  }

  _onViewInfo(event) {
      this._handleInfo(event.detail.item);
  }

  _changePolicyStatus(policy, action) {
      const dialog = this.shadowRoot.getElementById('appscoChangePolicyStatus');
      dialog.setPolicy(policy);
      dialog.setAction(action);
      dialog.open();
  }

  _onEnablePolicyAction(event) {
      this._changePolicyStatus((event.detail.policy ? event.detail.policy : this.policy), 'enable');
  }

  _onDisablePolicyAction(event) {
      this._changePolicyStatus((event.detail.policy ? event.detail.policy : this.policy), 'disable');
  }

  _onChangePolicyStatusAction(event) {
      const dialog = this.shadowRoot.getElementById('appscoChangePolicyStatus');
      dialog.setPolicy(event.detail.policy);
      dialog.setAction(event.detail.action);
      dialog.open();
  }

  _onPolicyStatusChanged(event) {
      const policy = event.detail.policy;
      this.modifyPolicy(policy);
      this.modifyPolicies([policy]);
      this._notify('Company policy successfully ' + (('active' === policy.status) ? 'enabled' : 'disabled') + '.');
  }

  _onPolicyUpdated(event) {
      const policy = event.detail.policy;
      this.modifyPolicy(policy);
      this.modifyPolicies([policy]);
      this._notify('Company policy successfully updated.');
  }
}
window.customElements.define(AppscoPoliciesPage.is, AppscoPoliciesPage);
