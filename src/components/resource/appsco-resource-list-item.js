import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoResourceListItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                --resource-image: {
                    width: 32px;
                    height: 32px;
                };

                --resource-initials-font-size: 16px;
            }
            :host .select-action, :host .icon-action {
                width: 32px;
                height: 32px;
            }
            :host .select-action {
                cursor: pointer;
            }
            :host iron-image {
                box-sizing: border-box;
                width: 28px;
                height: 28px;
                margin: 2px;
            }
        </style>

        <div class="select-action" on-tap="_onSelectItemAction">

            <iron-image class="resource-image" sizing="cover" preload="" fade="" src="[[ item.application_url ]]"></iron-image>

            <div class="icon-action">
                <div class="iron-action-inner">
                    <iron-icon icon="icons:check"></iron-icon>
                </div>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-resource-list-item'; }
}
window.customElements.define(AppscoResourceListItem.is, AppscoResourceListItem);
