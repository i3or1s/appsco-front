import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../components/components/appsco-price.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoUpdateSubscriptionAction extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-update-subscription-action;

                --paper-radio-button-checked-color: var(--app-primary-color-dark);
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host paper-input {
                --paper-input-container-label: {
                    left: 4px;
                };
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .num-of-subscriptions {
                min-width: 220px;
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host .info {
                margin: 0;
            }
            :host .mt {
                margin-top: 15px;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
            }
            :host .flex-center {
                @apply --layout-center;
            }
            :host .flex{
                @apply --layout-flex;
            }
            :host .baseline {
                @apply --layout-self-end;
                padding-bottom: 10px;
                text-align: center;
            }
            :host .text-center {
                text-align: center;
            }
            :host .op6 {
                opacity: 0.6;
            }
            :host .savings {
                color: var(--app-primary-color);
            }
        </style>

        <iron-ajax id="plansRequest" url="[[ _plansApi ]]" handle-as="json" headers="[[ _headers ]]" auto="" on-response="_handlePlansResponse"></iron-ajax>

        <iron-ajax id="getPublicKeyCall" auto="" url="[[ _publicKeyApi ]]" method="GET" headers="[[ _headers ]]" handle-as="json" on-response="_handlePublicKeyResponse">
        </iron-ajax>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>AppsCo Partner Subscription</h2>

            <appsco-loader active="[[ _purchaseLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <div>

                        <appsco-loader active="[[ _loadingPlans ]]" loader-alt="Appsco is loading payment method" multi-color=""></appsco-loader>

                        <p class="info">
                            AppsCo Partner provides yearly licences and monthly licences subscription plans.
                            You can purchase licences which you can then distribute to your customers.
                            During subscription period you can always cancel, upgrade or downgrade subscription.
                            When changing plans or quantities, we will optionally prorate the price we charge next month to make up for any price changes.
                            If you cancel subscription it will still remain active until subscription period end.
                        </p>
                        <div class="flex-vertical flex-center text-center">
                            <paper-input allowed-pattern="\\d+" class="num-of-subscriptions text-center" id="quantity" label="Number of subscriptions" name="subscription[numUsers]" error-message="Please enter number of subscriptions." auto-validate="" on-keyup="_updateTotalPrice"></paper-input>
                            <div style="width:100%">
                                <paper-radio-group selected="[[ _selectedPlan ]]" class="flex-horizontal" id="subscriptionPlan">

                                    <template is="dom-repeat" items="[[ _plans ]]">
                                        <paper-radio-button name="[[ item.id ]]" class="flex" value="[[ item.id ]]">[[ item.displayText ]]</paper-radio-button>
                                    </template>

                                </paper-radio-group>
                            </div>
                            <div style="width:100%" class="flex-horizontal">

                                <template is="dom-repeat" id="planList" items="[[ _plans ]]">
                                    <div class="flex">
                                        <appsco-price price="[[ _calculateTotalPrice(item) ]]" currency="[[ item.currency ]]"></appsco-price> / [[ item.interval ]]
                                        <br>
                                        <span class="op6"><appsco-price price="[[ item.amount ]]" currency="[[ item.currency ]]"></appsco-price> per licence / [[ item.interval ]]</span>
                                        <br>

                                        <template is="dom-if" if="[[ _isYearlyPlan(item) ]]">
                                            <span class="savings">20% Savings</span>
                                        </template>

                                    </div>
                                </template>

                            </div>
                            <paper-input class="coupon-code text-center" id="couponCode" label="Coupon code" name="subscription[coupon]"></paper-input>
                        </div>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onPurchaseAction" id="purchaseButton">Purchase</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-update-subscription-action'; }

  static get properties() {
      return {
          companyApi: {
              type: String
          },

          subscription: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          /**
           * Indicates if add application loader should be displayed or not.
           */
          _purchaseLoader: {
              type: Boolean,
              value: false
          },

          _subscriptionYear: {
              type: Number,
              value: 0
          },

          _subscriptionMonth: {
              type: Number,
              value: 0
          },

          _plansApi: {
              type: String,
              computed: "_computePlansApi(companyApi)"
          },

          _loadingPlans: {
              type: Boolean,
              value: true
          },

          _plans: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _purchaseApi: {
              type: String,
              computed: "_computePurchaseApi(companyApi, subscription)"
          },

          _selectedPlan: {
              type: String,
              computed: "_computeSelectedPlan(subscription, _plans)"
          },

          _stripePublicKey: {
              type: String,
              value: ''
          },

          _publicKeyApi: {
              type: String,
              computed: '_computePublicKeyApi(companyApi)'
          }
      };
  }

  _computePublicKeyApi(companyApi) {
      return companyApi + '/billing/pk';
  }

  _handlePublicKeyResponse(event) {
      if (!event.detail.response) {
          return;
      }
      this._stripePublicKey = event.detail.response.stripePublicKey;
  }

  _computePlansApi(companyApi) {
      return companyApi ? companyApi + '/billing/plans' : null;
  }

  _isYearlyPlan(plan) {
      return plan && plan.interval == 'year';
  }

  _updateTotalPrice() {
      var clonedPlansList = JSON.parse(JSON.stringify(this._plans));
      this.set('_plans', []);
      this.set('_plans', clonedPlansList);
  }

  _calculateTotalPrice(plan) {
      if (!plan) {
          return;
      }

      return this.$.quantity && this.$.quantity.value ? plan.amount * this.$.quantity.value : plan.amount;
  }

  _computeSelectedPlan(subscription, plans) {
      if (subscription && subscription.plan) {
          return subscription.plan.id;
      }
      if (plans && plans.length > 0) {
          return plans[0].id;
      }
      return null;
  }

  _computePurchaseApi(companyApi, subscription) {
      if (subscription && subscription.id) {
          return companyApi ? companyApi + '/billing/subscriptions/' + this.subscription.id : null;
      }
      return companyApi ? companyApi + '/billing/subscriptions' : null;
  }

  toggle() {
      this.$.dialog.toggle();
  }

  setSubscription(subscription) {
      this.subscription = subscription;
  }

  _onDialogOpened() {
      this.$.quantity.focus();
  }

  _onDialogClosed() {
      this._purchaseLoader = false;
      this._errorMessage = '';
      this.$.quantity.value = '';
      this.$.quantity.invalid = false;
  }

  _handlePlansResponse(event) {
      var response = event.detail.response;
      this.set('_plans', []);

      if (null == response || 0 === response.length) {
          this._loadingPlans = false;
          return false;
      }

      response.forEach(function(plan) {
          if (plan.type == 'distribution') {
              this.push('_plans', plan);
          }
      }, this);

      this._loadingPlans = false;
  }

  _onPurchaseAction() {
      var subscriptionsInput = this.$.quantity;

      if (subscriptionsInput.value.length === 0) {
          subscriptionsInput.invalid = true;
          subscriptionsInput.focus();
          return false;
      }

      var request = document.createElement('iron-request'),
          method = this.subscription && this.subscription.id ? 'PUT' : 'POST',
          options = {
              url: this._purchaseApi,
              method: method,
              handleAs: 'json',
              headers: this._headers
          },
          body = encodeURIComponent(this.$.quantity.name) +
                  '=' +
                  encodeURIComponent(this.$.quantity.value) +
                  '&' +
                  encodeURIComponent('subscription[period]') +
                  "=" +
                  encodeURIComponent(this.$.subscriptionPlan.selectedItem.value);
          if (this.$.couponCode.value) {
              body +=
                  '&' +
                  encodeURIComponent(this.$.couponCode.name) +
                  "=" +
                  encodeURIComponent(this.$.couponCode.value)
              ;
          }

      this._purchaseLoader = true;

      options.body = body;

      request.send(options).then(
          function(request) {
              if (request.response.requires_action) {
                  var stripe = Stripe(this._stripePublicKey);
                  var elements = stripe.elements();

                  stripe.handleCardPayment(request.response.client_secret).then(function(result) {
                      if (result.error) {
                          this._errorMessage = 'An error occured';
                          this._purchaseLoader = false;
                      } else {
                          this._paymentCompleted(request.response);
                      }
                  }.bind(this));
                  return;
              }

              this._paymentCompleted(request.response);
          }.bind(this),
          function() {
              this._errorMessage = request.response.message;
              this._purchaseLoader = false;
          }.bind(this)
      );
  }

  _paymentCompleted(response) {
      var request = document.createElement('iron-request'),
          options = {
              url: response.on_confirm,
              method: 'POST',
              handleAs: 'json',
              headers: this._headers
          };
      request.send(options).then(function() {
          this.$.dialog.close();

          this.dispatchEvent(new CustomEvent('subscription-updated', {
              bubbles: true,
              composed: true,
              detail: {
                  subscription: response
              }
          }));

          this._purchaseLoader = false;
      }.bind(this));
  }
}
window.customElements.define(AppscoUpdateSubscriptionAction.is, AppscoUpdateSubscriptionAction);
