import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-image/iron-image.js';
import { AppscoListItemBehavior } from '../components/components/appsco-list-item-behavior.js';
import '../components/components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoActiveIntegrationItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles">
            :host .item-image {
                width: 52px;
                height: 52px;
            }
            :host .requires-authorization {
                color: red;
            }
        </style>

        <div class="item" on-tap="_onItemAction">

            <div class="select-action" on-tap="_onSelectItemAction">

                <template is="dom-if" if="[[ selectable ]]">
                    <div class="select-action" on-tap="_onSelectItemAction">
                        <iron-image class="item-image" sizing="contain" src="[[ item.integration.image ]]" alt="[[ item.integration.title ]]"></iron-image>

                        <div class="icon-action">
                            <div class="iron-action-inner">
                                <iron-icon icon="icons:check"></iron-icon>
                            </div>
                        </div>
                    </div>
                </template>

                <template is="dom-if" if="[[ !selectable ]]">
                    <iron-image class="item-image" sizing="contain" src="[[ item.integration.image ]]" alt="[[ item.integration.title ]]"></iron-image>
                </template>
            </div>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.name ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Status:&nbsp;</span>
                    <span class="info-value">
                        <template is="dom-if" if="[[ item.active ]]">
                            active
                        </template>
                        <template is="dom-if" if="[[ !item.active ]]">
                            inactive
                        </template>
                    </span>
                </div>
                <div class="info">
                    <span class="info-value">
                        <template is="dom-if" if="[[ item.requires_authorization ]]">
                            <span class="requires-authorization">Requires reauthorization</span>
                        </template>
                    </span>
                </div>
            </div>

            <div class="actions">
                <template is="dom-if" if="[[ _forceSyncAvailable ]]">
                    <paper-button on-tap="_onForceSync">Resync integration</paper-button>
                </template>
                <paper-button on-tap="_onEditItemAction">Edit</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-active-integration-item'; }

  static get properties() {
      return {
          _forceSyncAvailable: {
              type: Boolean,
              computed: '_computeForceSyncAvailable(item)'
          }
      };
  }

  _onForceSync() {
      this.dispatchEvent(new CustomEvent('force-sync', {
          bubbles: true,
          composed: true,
          detail: {
              integration: this.item
          }
      }));
  }

  _computeForceSyncAvailable(item) {
      return (item && item.kind === 'ra');
  }
}
window.customElements.define(AppscoActiveIntegrationItem.is, AppscoActiveIntegrationItem);
