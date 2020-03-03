import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoProvisioningActions extends PolymerElement {
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
                @apply --appsco-provisioning-actions;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --provisioning-action;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            .add-action{
                @apply --add-item-action;
                @apply --primary-button;
            }
        </style>

        <div class="action flex-none">
            <paper-button class="add-action" on-tap="_onAddAction">Add</paper-button>
        </div>
`;
    }

    static get is() { return 'appsco-provisioning-actions'; }

    ready() {
        super.ready();

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
    }

    _onAddAction() {
        this.dispatchEvent(new CustomEvent('add-integration', { bubbles: true, composed: true }));
    }

    reset() {}
}
window.customElements.define(AppscoProvisioningActions.is, AppscoProvisioningActions);
