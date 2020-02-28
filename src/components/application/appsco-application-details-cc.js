import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationDetailsCC extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --application-details-label;
            }

            :host div[content] {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                @apply --application-details-value;
            }

            :host .flex {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
            }

            :host > div {
                margin: 6px 0;
            }
        </style>

        <template is="dom-if" if="[[ claims.cardHolder ]]">
            <div label="">Card holder</div>
            <div content="">
                <div class="flex">
                    [[ claims.cardHolder ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.cardHolder ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.cardNumber ]]">
            <div label="">Card number</div>
            <div content="">
                <div class="flex">
                    [[ claims.cardNumber ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.cardNumber ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.verificationNumber ]]">
            <div label="">Verification number</div>
            <div content="">
                <div class="flex">
                    ********************
                </div>
                <div>
                    <appsco-copy value="[[ claims.verificationNumber ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.expireMonth ]]">
            <div label="">Expire month</div>
            <div content="">
                <div class="flex">
                    [[ claims.expireMonth ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.expireMonth ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.expireYear ]]">
            <div label="">Expire year</div>
            <div content="">
                <div class="flex">
                    [[ claims.expireYear ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.expireYear ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.note ]]">
            <div label="">Note</div>
            <div content="">
                <div class="flex">
                    [[ claims.note ]]
                </div>
                <div>

                </div>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-application-details-cc'; }

  static get properties() {
      return {
          claims: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          }
      };
  }
}
window.customElements.define(AppscoApplicationDetailsCC.is, AppscoApplicationDetailsCC);
