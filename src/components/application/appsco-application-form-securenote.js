import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationFormSecurenote extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
    static get template() {
        return html`
        <paper-textarea id="note" rows="3" data-field="" label="Note" required="" error-message="Please enter note." value="[[ claims.note ]]" name\$="[[ claimsNamePrefix ]][note]"></paper-textarea>

        <iron-a11y-keys keys="enter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-application-form-securenote'; }

    static get properties() {
        return {
            claimsNamePrefix: {
                type: String,
                value: "claims_securenote"
            }
        };
    }
}
window.customElements.define(AppscoApplicationFormSecurenote.is, AppscoApplicationFormSecurenote);
