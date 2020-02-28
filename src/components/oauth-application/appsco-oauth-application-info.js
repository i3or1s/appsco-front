import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../components/appsco-copy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOAuthApplicationInfo extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                font-size: 12px;
            }
            :host div[content] {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                font-size: 14px;
            }
            :host .value {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
            }
        </style>

        <div label="">Client ID</div>
        <div content="">
            <div class="value">[[ oAuthApplication.client_id ]]</div>
            <div>
                <appsco-copy value="[[ oAuthApplication.client_id ]]" name="client_id"></appsco-copy>
            </div>
        </div>

        <div label="">Client secret</div>
        <div content="">
            <div class="value">[[ oAuthApplication.client_secret ]]</div>
            <div>
                <appsco-copy value="[[ oAuthApplication.client_secret ]]" name="client_secret"></appsco-copy>
            </div>
        </div>

        <template is="dom-if" if="[[ !displayCopyValuesOnly ]]">
            <template is="dom-if" if="[[ oAuthApplication.website_url ]]">
                <div label="">Website URL</div>
                <div content="">
                    <div class="value">[[ oAuthApplication.website_url ]]</div>
                </div>
            </template>

            <template is="dom-if" if="[[ oAuthApplication.redirect_url ]]">
                <div label="">Redirect URL</div>
                <div content="">
                    <div class="value">[[ oAuthApplication.redirect_url ]]</div>
                </div>
            </template>


            <template is="dom-if" if="[[ oAuthApplication.description ]]">
                <div label="">Description</div>
                <div content="">
                    <div class="value">[[ oAuthApplication.description ]]</div>
                </div>
            </template>
        </template>
`;
  }

  static get is() { return 'appsco-oauth-application-info'; }

  static get properties() {
      return {
          oAuthApplication: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          displayCopyValuesOnly: {
              type: Boolean,
              value: false
          }
      };
  }
}
window.customElements.define(AppscoOAuthApplicationInfo.is, AppscoOAuthApplicationInfo);
