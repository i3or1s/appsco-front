import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationFormUnpw extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
  static get template() {
    return html`
        <paper-input id="username" data-field="" label="Username" value="[[ claims.username ]]" name\$="[[ claimsNamePrefix ]][username]" error-message="Please enter username" required=""></paper-input>
        <paper-input id="password" data-field="" label="Password" type="password" value="[[ claims.password ]]" name\$="[[ claimsNamePrefix ]][password]" required="" error-message="Please enter password"></paper-input>
        <paper-textarea id="note" rows="3" data-field="" label="Note" value="[[ claims.note ]]" name\$="[[ claimsNamePrefix ]][note]"></paper-textarea>
`;
  }

  static get is() { return 'appsco-application-form-unpw'; }

  static get properties() {
      return {
          claimsNamePrefix: {
              type: String,
              value: "claims_unpw"
          }
      };
  }
}
window.customElements.define(AppscoApplicationFormUnpw.is, AppscoApplicationFormUnpw);
