/**
`appsco-account-actions`
Component that holds actions related to account page.

Example:
    <body>
        <appsco-account-actions advanced>
        </appsco-account-actions>

### Styling

`<appsco-account-actions>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-account-actions` | Mixin for the root element. | `{}`
`--appsco-account-advanced-settings-action` | Mixin for inner advanced settings action element. | `{}`

@demo demo/appsco-account-actions.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/shadow.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountActions extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                @apply --appsco-account-actions;
            }
            :host .advanced-settings-button {
                @apply --account-advanced-settings-action;
            }
            :host .advanced-settings-button[active] {
                @apply --shadow-elevation-2dp;
                @apply --account-advanced-settings-action-active;
            }
            :host .advanced-settings-button[disabled] {
                opacity: 0.5;
            }
        </style>

        <template is="dom-if" if="[[ advanced ]]">
            <paper-button id="advancedSettingsAction" class="advanced-settings-button" toggles="" on-tap="_onAdvancedSettingsAction">Advanced settings</paper-button>
        </template>
`;
  }

  static get is() { return 'appsco-account-actions'; }

  static get properties() {
      return {
          advanced: {
              type: Boolean,
              value: false
          }
      };
  }

  _onAdvancedSettingsAction() {
      this.dispatchEvent(new CustomEvent('advanced-settings', { bubbles: true, composed: true }));
  }

  disableAdvancedSettings() {
      this.shadowRoot.getElementById('advancedSettingsAction').disabled = true;
  }

  enableAdvancedSettings() {
      this.shadowRoot.getElementById('advancedSettingsAction').disabled = false;
  }

  resetAdvancedSettingsAction() {
      this.shadowRoot.getElementById('advancedSettingsAction').active = false;
  }
}
window.customElements.define(AppscoAccountActions.is, AppscoAccountActions);
