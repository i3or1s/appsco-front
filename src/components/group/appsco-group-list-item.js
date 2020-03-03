import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import './appsco-company-group-image.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoGroupListItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                --group-image: {
                    width: 32px;
                    height: 32px;
                };

                --group-initials-font-size: 16px;
            }
            :host .select-action, :host .icon-action {
                width: 32px;
                height: 32px;
            }
            :host .select-action {
                cursor: pointer;
            }
        </style>

        <div class="select-action" on-tap="_onSelectItemAction">
            <appsco-company-group-image group="[[ item ]]"></appsco-company-group-image>

            <div class="icon-action">
                <div class="iron-action-inner">
                    <iron-icon icon="icons:check"></iron-icon>
                </div>
            </div>
        </div>
`;
    }

    static get is() {
        return 'appsco-group-list-item';
    }
}
window.customElements.define(AppscoGroupListItem.is, AppscoGroupListItem);
