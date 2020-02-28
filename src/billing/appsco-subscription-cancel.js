import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/components/appsco-loader.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoSubscriptionCancel extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Cancel subscription</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <div>
                        <p>If you cancel subscription it will still remain active until subscription period end.</p>
                        <p>Please confirm subscription canceling.</p>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onConfirm">Confirm</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-subscription-cancel'; }

  static get properties() {
      return {
          _subscription: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          companyApi: {
              type: String
          },

          _subscriptionApi: {
              type: String,
              computed: '_computeSubscriptionApi(companyApi)'
          },

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  setSubscription(subscription) {
      this._subscription = subscription;
  }

  _computeSubscriptionApi(companyApi) {
      return companyApi + '/billing/subscriptions';
  }

  toggle() {
      this.$.dialog.toggle();
  }

  _onDialogClosed() {
      this._loader = false;
  }

  _onConfirm() {
      var request = document.createElement('iron-request'),
          options = {
              url: this._subscriptionApi + '/' + this._subscription.id,
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          };

      this._loader = true;

      request.send(options).then(function(request) {
          this.$.dialog.close();
          this.dispatchEvent(new CustomEvent('subscription-canceled', {
              bubbles: true,
              composed: true,
              detail: {
                  subscription: request.response
              }
          }));
      }.bind(this));
  }
}
window.customElements.define(AppscoSubscriptionCancel.is, AppscoSubscriptionCancel);
