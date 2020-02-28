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
import '../account/appsco-account-image.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoPolicyItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles">
            :host .policy-icon-container {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 26px;
                background-color: var(--policy-icon-background-color, var(--account-initials-background-color));
                position: relative;
            }
            :host .policy-icon {
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
            :host([policy-active]) .policy-icon-container {
                background-color: var(--google-yellow-300);
            }
            :host([policy-active]) .policy-icon-container .policy-icon {
                color: #ffffff;
            }
            :host([policy-active][policy-configured]) .policy-icon-container {
                background-color: var(--success-color);
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax id="getPartnerAdminsApiRequest" url="[[ _partnerAdminsApiUrl ]]" headers="[[ _headers ]]" auto="" on-error="_onPartnerAdminsError" on-response="_onPartnerAdminsResponse"></iron-ajax>

        <iron-ajax id="getLicencesApiRequest" url="[[ _licencesApiUrl ]]" headers="[[ _headers ]]" auto="" on-error="_onLicencesError" on-response="_onLicencesResponse"></iron-ajax>

        <div class="item">

            <template is="dom-if" if="[[ selectable ]]">
                <div class="select-action" on-tap="_onSelectItemAction">

                    <div class="policy-icon-container">
                        <iron-icon class="policy-icon" icon="[[ _icon ]]"></iron-icon>
                    </div>

                    <div class="icon-action">
                        <div class="iron-action-inner">
                            <iron-icon icon="icons:check"></iron-icon>
                        </div>
                    </div>
                </div>
            </template>

            <template is="dom-if" if="[[ !selectable ]]">
                <div class="policy-icon-container">
                    <iron-icon class="policy-icon" icon="[[ _icon ]]"></iron-icon>
                </div>
            </template>

            <div class="item-info item-basic-info">
                <span class="info-label">[[ item.name ]]</span>
                <span class="info-value">[[ item.type ]]</span>
            </div>

            <div class="actions">
                <template is="dom-if" if="[[ policyActive ]]">
                    <paper-button on-tap="_onDisableItemAction">Disable</paper-button>
                </template>

                <template is="dom-if" if="[[ !policyActive ]]">
                    <paper-button on-tap="_onEnableItemAction">Enable</paper-button>
                </template>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-policy-item'; }

  static get properties() {
      return {
          policyActive: {
              type: Boolean,
              computed: '_computeActiveStatus(item)',
              reflectToAttribute: true
          },

          policyConfigured: {
              type: Boolean,
              computed: '_computeConfiguredStatus(item, policyActive)',
              reflectToAttribute: true
          },

          _icon: {
              type: String,
              computed: '_computeIcon(policyActive)'
          },

          mobileScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          }
      };
  }

  ready() {
      super.ready();

      afterNextRender(this, function () {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('tap', this._onItemAction);
  }

  _computeActiveStatus(policy) {
      return ('active' === policy.status);
  }

  _computeConfiguredStatus(policy, policyActive) {
      return (policyActive && !policy.missing_config);
  }

  _computeIcon(active) {
      return (active ? 'icons:check' : 'icons:clear');
  }

  _onEnableItemAction(event) {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('enable-policy', {
          bubbles: true,
          composed: true,
          detail: {
              policy: this.item
          }
      }));
  }

  _onDisableItemAction(event) {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('disable-policy', {
          bubbles: true,
          composed: true,
          detail: {
              policy: this.item
          }
      }));
  }
}
window.customElements.define(AppscoPolicyItem.is, AppscoPolicyItem);
