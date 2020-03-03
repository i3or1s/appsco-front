import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationFormSoftwareLicence extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
    static get template() {
        return html`
        <div class="input-container">
            <paper-input id="productName" data-field="" label="Product name" name\$="[[ claimsNamePrefix ]][productName]" value="[[ claims.productName ]]"></paper-input>
        </div>

        <div class="input-container">
            <paper-textarea id="licenceKey" data-field="" label="Licence key" value="[[ claims.licenceKey ]]" name\$="[[ claimsNamePrefix ]][licenceKey]"></paper-textarea>
        </div>

        <div class="input-container">
            <paper-input id="publisher" data-field="" name\$="[[ claimsNamePrefix ]][publisher]" label="Publisher" value="[[ claims.publisher ]]"></paper-input>
        </div>

        <div class="input-container">
            <paper-input id="supportEmail" type="email" data-field="" name\$="[[ claimsNamePrefix ]][supportEmail]" label="Support email" value="[[ claims.supportEmail ]]" auto-validate="" error-message="Please type in correct email."></paper-input>
        </div>

        <div class="input-container">
            <paper-input id="website" data-field="" name\$="[[ claimsNamePrefix ]][website]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" error-message="Invalid Url" auto-validate="" label="Website" value="[[ claims.website ]]"></paper-input>
        </div>

        <div class="input-container">
            <paper-input id="numberOfLicences" data-field="" name\$="[[ claimsNamePrefix ]][numberOfLicences]" label="Number of licences" value="[[ claims.numberOfLicences ]]" auto-validate="" pattern="[0-9]*" error-message="Digits only!"></paper-input>
        </div>

        <div class="input-container date-container">
            <vaadin-date-picker id="licenceExpirationDate" data-field="" label="Licence expiration date" value="[[ claims.licenceExpirationDate ]]" name\$="[[ claimsNamePrefix ]][licenceExpirationDate]"></vaadin-date-picker>
        </div>

        <div class="input-container">
            <paper-textarea id="note" rows="3" data-field="" label="Note" value="[[ claims.note ]]" name\$="[[ claimsNamePrefix ]][note]"></paper-textarea>
        </div>
`;
    }

    static get is() { return 'appsco-application-form-softwarelicence'; }

    static get properties() {
        return {
            claimsNamePrefix: {
                type: String,
                value: "claims_softwarelicence"
            }
        };
    }
}
window.customElements.define(AppscoApplicationFormSoftwareLicence.is, AppscoApplicationFormSoftwareLicence);
