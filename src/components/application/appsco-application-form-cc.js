import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/gold-cc-input/gold-cc-input.js';
import '@polymer/gold-cc-cvc-input/gold-cc-cvc-input.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-credit-card-types.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationFormCC extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
  static get template() {
    return html`
        <appsco-credit-card-types types="{{ cardTypes }}"></appsco-credit-card-types>

        <div class="input-container">
            <paper-input id="cardHolder" data-field="" label="Card holder" value="[[ claims.cardHolder ]]" name\$="[[ claimsNamePrefix ]][cardHolder]"></paper-input>
        </div>

        <div class="input-container" hidden="">
            <paper-dropdown-menu id="dropdownCreditCardType" label="Credit card type" horizontal-align="left">
                <paper-listbox id="paperListboxCardType" class="dropdown-content filter" attr-for-selected="name" selected="[[ cardType ]]" slot="dropdown-content">

                    <template is="dom-repeat" items="[[ cardTypes ]]">
                        <paper-item name="[[ item.name ]]" code="[[ item.code ]]">[[ item.title ]]</paper-item>
                    </template>

                </paper-listbox>
            </paper-dropdown-menu>
        </div>

        <div class="input-container">
            <gold-cc-input id="cardNumber" data-field="" label="Card number" card-type="{{ cardType }}" required="" auto-validate="" error-message="Credit card number is not valid." value="[[ _cardNumber ]]" name\$="[[ claimsNamePrefix ]][cardNumber]"></gold-cc-input>
        </div>

        <div class="input-container">
            <gold-cc-cvc-input id="verificationNumber" data-field="" label="Verification number" card-type="[[ cardType ]]" required="" auto-validate="" error-message="Verification number is not valid." value="[[ _verificationNumber ]]" name\$="[[ claimsNamePrefix ]][verificationNumber]"></gold-cc-cvc-input>
        </div>

        <div class="input-container">
            <paper-input id="expireMonth" auto-validate="" pattern="^(0?[1-9]|1[012])\$" error-message="Value should be between 1 and 12." data-field="" label="Expire month" value="[[ claims.expireMonth ]]" name\$="[[ claimsNamePrefix ]][expireMonth]"></paper-input>
        </div>

        <div class="input-container">
            <paper-input id="expireYear" data-field="" label="Expire year" value="[[ claims.expireYear ]]" name\$="[[ claimsNamePrefix ]][expireYear]"></paper-input>
        </div>

        <paper-textarea id="note" rows="3" data-field="" label="Note" value="[[ claims.note ]]" name\$="[[ claimsNamePrefix ]][note]"></paper-textarea>
`;
  }

  static get is() { return 'appsco-application-form-cc'; }

  static get properties() {
      return {
          _cardNumber: {
              type: String,
              computed: '_cardNumberComputed(claims)'
          },

          _verificationNumber: {
              type: String,
              computed: '_verificationNumberComputed(claims)'
          },

          claimsNamePrefix: {
              type: String,
              value: "claims_cc"
          }
      };
  }

  _cardNumberComputed(claims) {
      return (claims && claims.cardNumber) ? claims.cardNumber : '';
  }

  _verificationNumberComputed(claims) {
      return (claims && claims.verificationNumber) ? claims.verificationNumber : '';
  }
}
window.customElements.define(AppscoApplicationFormCC.is, AppscoApplicationFormCC);
