import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../components/appsco-date-format.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOAuthApplicationCertificateItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles">
            :host .item-icon-container {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 26px;
                background-color: var(--certificate-icon-background-color, var(--account-initials-background-color));
                position: relative;
            }
            :host .item-icon {
                width: 24px;
                height: 24px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
            :host([preview]) .item-basic-info {
                width: 100%;
                box-sizing: border-box;
            }
            :host([preview]) .info-label {
                font-size: 14px;
                width: 100%;
            }
            :host([mobile-screen]) .item-additional-info {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <template is="dom-if" if="[[ preview ]]">
            <div class="item-info item-basic-info">
                <span class="info-label group-title">[[ item.fingerprint ]]</span>
            </div>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">

                <template is="dom-if" if="[[ selectable ]]">
                    <div class="select-action" on-tap="_onSelectItemAction">

                        <div class="item-icon-container">
                            <iron-icon class="item-icon" icon="icons:fingerprint"></iron-icon>
                        </div>

                        <div class="icon-action">
                            <div class="iron-action-inner">
                                <iron-icon icon="icons:check"></iron-icon>
                            </div>
                        </div>
                    </div>
                </template>

                <template is="dom-if" if="[[ !selectable ]]">
                    <div class="item-icon-container">
                        <iron-icon class="item-icon" icon="icons:fingerprint"></iron-icon>
                    </div>
                </template>

                <div class="item-info item-basic-info">
                    <span class="info-label group-title">[[ item.fingerprint ]]</span>
                </div>

                <div class="item-info item-additional-info">
                    <div class="info">
                        <span class="info-label">Valid until:&nbsp;</span>
                        <appsco-date-format class="info-value" date="[[ item.valid_to.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
                    </div>
                </div>

                <div class="actions">
                    <paper-button on-tap="_onRemoveItemAction">Remove</paper-button>
                </div>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-oauth-application-certificate-item'; }

  static get properties() {
      return {
          preview: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          mobileScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          }
      };
  }

  _onRemoveItemAction(event) {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('remove-item', {
          bubbles: true,
          composed: true,
          detail: {
              item: this.item
          }
      }));
  }
}
window.customElements.define(AppscoOAuthApplicationCertificateItem.is, AppscoOAuthApplicationCertificateItem);
