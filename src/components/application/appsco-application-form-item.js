import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationFormItem extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
  static get template() {
    return html`
        <paper-input id="username" data-field="" label="Username" value="[[ claims.username ]]" name\$="[[ claimsNamePrefix ]][username]" required="" error-message="Please enter username"></paper-input>
        <paper-input id="password" data-field="" label="Password" type="password" value="[[ claims.password ]]" name\$="[[ claimsNamePrefix ]][password]" required="" error-message="Please enter password"></paper-input>
        <paper-textarea id="note" rows="3" data-field="" label="Note" value="[[ claims.note ]]" name\$="[[ claimsNamePrefix ]][note]"></paper-textarea>
`;
  }

  static get is() { return 'appsco-application-form-item'; }

  static get properties() {
      return {
          claimsNamePrefix: {
              type: String,
              value: "claims_item"
          }
      };
  }
}
window.customElements.define(AppscoApplicationFormItem.is, AppscoApplicationFormItem);
