import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { AppscoListItemBehavior } from '../components/components/appsco-list-item-behavior.js';
import '../components/components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAvailableIntegrationItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles">
            :host {
                --icon-action-border-radius: 16px;
            }
            :host([tablet-screen]) {
                display: none;
            }
            :host .item-basic-info {
                width: 220px;
                @apply --item-basic-info;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" on-tap="_onItemAction">

            <iron-image class="item-icon" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ item.image ]]"></iron-image>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.title ]]</span>
            </div>

        </div>
`;
  }

  static get is() { return 'appsco-available-integration-item'; }

  static get properties() {
      return {
          tabletScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          }
      };
  }
}
window.customElements.define(AppscoAvailableIntegrationItem.is, AppscoAvailableIntegrationItem);
