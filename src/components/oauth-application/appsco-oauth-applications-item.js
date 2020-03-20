import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoOAuthApplicationsItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                width: 100%;
            }
            :host .oauth-application-icon-container {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 26px;
                background-color: var(--oauth-application-icon-background-color, var(--account-initials-background-color));
                position: relative;
            }
            :host .oauth-application-icon {
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
            :host .item-info {
                padding: 0 10px;
            }
        </style>

        <div class="item">

            <div class="oauth-application-icon-container">
                <iron-icon class="oauth-application-icon" icon="device:widgets"></iron-icon>
            </div>

            <div class="item-info item-basic-info">
                <span class="info-label group-title">[[ item.title ]]</span>
                <span class="info-value">oAuth Application</span>
            </div>

            <div class="actions">
                <paper-button on-tap="_onEditItemAction">Edit</paper-button>
                <paper-button on-tap="_onRemoveItemAction">Remove</paper-button>

            </div>

        </div>
`;
    }

    static get is() { return 'appsco-oauth-application-item'; }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this._addListeners();
            this.dispatchEvent(new CustomEvent('component-ready', { bubbles: true, composed: true }));
        });
    }

    _addListeners() {
        this.addEventListener('tap', this._onItemAction);
    }

    _onEditItemAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('edit-oauth-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.item
            }
        }));
    }

    _onRemoveItemAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('remove-oauth-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.item
            }
        }));
    }
}
window.customElements.define(AppscoOAuthApplicationsItem.is, AppscoOAuthApplicationsItem);
