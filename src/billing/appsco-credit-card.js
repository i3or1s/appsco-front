import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/gold-cc-input/gold-cc-input.js';
import '@polymer/gold-cc-cvc-input/gold-cc-cvc-input.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCreditCard extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            #stripe_cc_dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            #stripe_cc_dialog paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            #stripe_cc_dialog appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            #stripe_cc_dialog .buttons paper-button {
                @apply --paper-dialog-button;
            }
            #stripe_cc_dialog .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }

            #stripe_cc_dialog {
                background-color: #fff;
            }

            #stripe_cc_dialog .form-row {
                margin-bottom: 40px;
                border-bottom: 1px solid #EEE;
            }

            #stripe_cc_dialog #creditCardForm {
                margin-top: 40px;
            }

            #stripe_cc_dialog #card_number {

            }

        </style>

        <iron-ajax id="getPublicKeyCall" url="[[ _publicKeyApi ]]" method="GET" headers="[[ _headers ]]" handle-as="json" on-response="_handlePublicKeyResponse">
        </iron-ajax>

        <paper-dialog id="stripe_cc_dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed" style="display: none;">
            <h2>Payment method</h2>
            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>
                    <p>Once new credit card is added previous credit card will be lost.</p>
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                    <div class="form-row">
                        <div class="input-container" id="card_number"></div>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAddCreditCard">Add</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-credit-card'; }

  static get properties() {
      return {
          companyApi: {
              type: String
          },

          _creditCardApi: {
              type: String,
              computed: '_computeCreditCardApi(companyApi)'
          },

          _publicKeyApi: {
              type: String,
              computed: '_computePublicKeyApi(companyApi)'
          },

          _stripePublicKey: {
              type: String,
              value: ''
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          },

          _target: {
              type: Object
          }
      };
  }

  /** Stripe controls do not work with shadow root so this hack is ugly but necessary */
  ready() {
      super.ready();

      afterNextRender(this, function() {
          document.body.appendChild(this.root);
          this._target = this.shadowRoot.getElementById('creditCardForm');
      });
  }

  _computeCreditCardApi(companyApi) {
      return companyApi + '/billing/cc';
  }

  _computePublicKeyApi(companyApi) {
      return companyApi + '/billing/pk';
  }

  toggle() {
      this.$.stripe_cc_dialog.toggle();
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  _onDialogOpened() {
      this._showLoader();
      this.$.getPublicKeyCall.generateRequest();
  }

  _onDialogClosed() {
      this._hideLoader();
  }

  _handlePublicKeyResponse(event) {
      this._stripePublicKey = event.detail.response.stripePublicKey;
      this.stripe = new Stripe(this._stripePublicKey);
      this.elements = this.stripe.elements();
      this.cardNumber = this.elements.create('card', {
          hidePostalCode: true
      });
      this.cardNumber.mount('#card_number');
      this._hideLoader();
  }

  _stripeResponseHandler(result) {
      if (result.error) {
          this._errorMessage = result.error.message;
          this._hideLoader();
          return;
      }

      var request = document.createElement('iron-request'),
          options = {
              url: this._creditCardApi,
              method: 'POST',
              handleAs: 'json',
              headers: this._headers,
              body: 'stripeToken=' + result.token.id
          };

      this._showLoader();
      request.send(options).then(function() {
          if (200 === request.status) {
              this.$.stripe_cc_dialog.close();
              this.dispatchEvent(new CustomEvent('credit-card-added', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      credit_card: request.response
                  }
              }));
          }
      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();
      }.bind(this));
  }

  _onAddCreditCard() {
      if (this.stripe) {
          this.stripe.createToken(this.cardNumber).then(function(result) {
              this._stripeResponseHandler(result);
          }.bind(this));
      }
  }

  _onEnter() {
      this._onAddCreditCard();
  }
}
window.customElements.define(AppscoCreditCard.is, AppscoCreditCard);
