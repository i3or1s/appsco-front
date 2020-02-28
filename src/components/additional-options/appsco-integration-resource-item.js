import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoIntegrationResourceItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles"></style>
        <style>
            :host {
                width: 100%;
                margin: 0 0 10px 0;
            }
        </style>

        <div class="item" on-tap="_onItemAction">
            <iron-image class="item-icon not-selectable" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ _resourceIcon ]]"></iron-image>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.title ]]</span>
            </div>

            <div class="actions">
                <paper-button on-tap="_onAddItemAction" disabled="[[ item.exists ]]">Add</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-integration-resource-item'; }

  static get properties() {
      return {
          _resourceIcon: {
              type: String,
              computed: '_computeResourceIcon(item)'
          }
      };
  }

  _computeResourceIcon(resource) {
      return resource.application_url ? resource.application_url : (resource.icon_url ? resource.icon_url : null);
  }

  _onAddItemAction(event) {
      event.preventDefault();

      this.dispatchEvent(new CustomEvent('add-item', {
          bubbles: true,
          composed: true,
          detail: {
              item: this.item
          }
      }));
  }
}
window.customElements.define(AppscoIntegrationResourceItem.is, AppscoIntegrationResourceItem);
