import '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoIntegrationRulesOperators extends PolymerElement {
  static get template() {
    return html`

`;
  }

  static get is() { return 'appsco-integration-rules-operators'; }

  static get properties() {
      return {
          operators: {
              type: Object,
              value: {
                  "equal": "Equals",
                  "notEqual": "Does not equal",
                  "contains": "Contains",
                  "notContains": "Does not contain",
                  "memberOf": "Is member of",
                  "notMemberOf": "Is not member of",
                  "matching": "Matching",
                  "startsWith": "Starts with",
                  "endsWith": "Ends with"
              }
          }
      };
  }

  getOperator(operatorCode) {
      return (this.operators[operatorCode]) ? this.operators[operatorCode] : operatorCode;
  }
}
window.customElements.define(AppscoIntegrationRulesOperators.is, AppscoIntegrationRulesOperators);
