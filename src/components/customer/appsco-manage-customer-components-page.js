import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-customer-partner-admins.js';
import '../page/appsco-layout-with-cards-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoManageCustomerComponentsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-layout-with-cards-styles">
            :host .subscription-paid-partner {
                padding-bottom: 5px;
            }
            :host .subscription-paid-customer {
                padding-top: 15px;
            }
            :host .customer-used-licences {
                padding-top: 5px;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="cols-layout two-cols-layout">
            <div class="col">
                <paper-card heading="Partner admins" class="card">
                    <div class="card-content">
                        <appsco-customer-partner-admins id="appscoCustomerPartnerAdmins" customer="[[ customer ]]" list-api="[[ customerPartnerAdminsApi ]]" authorization-token="[[ authorizationToken ]]" size="5" auto-load-active="" preview=""></appsco-customer-partner-admins>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageCustomerRoles">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Customer subscription" class="card">
                    <div class="card-content">
                        <template is="dom-if" if="[[ _isSubscriptionPaidExternally ]]">
                            <div class="subscription-paid-partner">
                                Subscription is paid for the customer by partner.
                            </div>
                            <div class="subscription-paid-partner&quot;">
                                Number of licences: [[ customer.max_subscription_size ]]
                            </div>
                        </template>
                        <template is="dom-if" if="[[ !_isSubscriptionPaidExternally ]]">
                            <div class="subscription-paid-customer">
                                Subscription is paid by customer.
                            </div>
                        </template>
                        <template is="dom-if" if="[[ _isSubscriptionPaidExternally ]]">
                            <div class="customer-used-licences">
                                Customer has [[ customer.used_licences ]] used licences currently.
                            </div>
                        </template>
                    </div>
                    <div class="card-actions">
                            <paper-button on-tap="_onManageCustomerSubscription">Manage</paper-button>
                        </div>
                </paper-card>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-manage-customer-components-page'; }

  static get properties() {
      return {
          customer: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          customerPartnerAdminsApi: {
              type: String
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          mediumScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          tabletScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          _isSubscriptionPaidExternally: {
              type: Boolean,
              computed: '_computeIsSubscriptionPaidExternally(customer)'
          },

          animationConfig: {
              type: Object
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(tabletScreen, mediumScreen)'
      ];
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': [{
              name: 'cascaded-animation',
              animation: 'fade-in-animation',
              nodes: dom(this.root).querySelectorAll('paper-card'),
              nodeDelay: 50,
              timing: {
                  delay: 200,
                  duration: 100
              }
          }],
          'exit': [{
              name: 'hero-animation',
              id: 'hero',
              fromPage: this
          }, {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 500
              }
          }]
      };

      beforeNextRender(this, function() {
          if (this.tabletScreen || this.mediumScreen) {
              this.updateStyles();
          }
      });
  }

  loadPage() {
      this._loadRoles();
  }

  reloadCustomer(customer) {
      this.set('customer', {});
      this.set('customer', customer);
  }

  reloadPartnerAdmins() {
      this.$.appscoCustomerPartnerAdmins.reloadPartnerAdmins();
  }

  removePartnerAdmins(partnerAdmins) {
      this.$.appscoCustomerPartnerAdmins.removePartnerAdmins(partnerAdmins);
  }

  _loadRoles() {
      this.$.appscoCustomerPartnerAdmins.loadRoles();
  }

  _updateScreen(tablet, medium) {
      this.updateStyles();
  }

  _setSharedElement(target) {
      while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
          target = target.parentNode;
      }

      this.sharedElements = {
          'hero': target
      };
  }

  _onManageCustomerRoles(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-customer-roles', { bubbles: true, composed: true }));
  }

  _computeIsSubscriptionPaidExternally(customer) {
      return customer && customer.subscription_paid_externally == true;
  }

  _onManageCustomerSubscription() {
      this.dispatchEvent(new CustomEvent('manage-customer-subscription', {
          bubbles: true,
          composed: true,
          detail: {
              'customer' : this.customer
          }
      }));
  }
}
window.customElements.define(AppscoManageCustomerComponentsPage.is, AppscoManageCustomerComponentsPage);
