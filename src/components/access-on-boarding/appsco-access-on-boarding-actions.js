import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccessOnBoardingActions extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                margin-right: -10px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                @apply --appsco-access-on-boarding-actions;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-flex-none;
                @apply --access-access-on-boarding-action;
            }
            :host .export-action {
                @apply --primary-button;
                min-width: 100px;
            }
        </style>

        <div class="action">
            <paper-button class="export-action" on-tap="_onExportAction">Export</paper-button>
        </div>
`;
  }

  static get is() { return 'appsco-access-on-boarding-actions'; }

  _onExportAction() {
      this.dispatchEvent(new CustomEvent('export-access-on-boarding', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoAccessOnBoardingActions.is, AppscoAccessOnBoardingActions);
