import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../components/appsco-copy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationWebhookItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host .item {
                cursor: default;
            }
            :host .icon-container {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 26px;
                background-color: var(--webhook-icon-background-color, var(--account-initials-background-color));
                position: relative;
                @apply --layout-flex-none;
            }
            :host .webhook-icon {
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
            :host appsco-copy {
                margin-right: 5px;
            }
        </style>

        <div class="item" on-tap="_onItemAction">
            <template is="dom-if" if="[[ selectable ]]">
                <div class="select-action" on-tap="_onSelectItemAction">

                    <div class="icon-container">
                        <iron-icon class="webhook-icon" icon="av:call-to-action"></iron-icon>
                    </div>

                    <div class="icon-action">
                        <div class="iron-action-inner">
                            <iron-icon icon="icons:check"></iron-icon>
                        </div>
                    </div>
                </div>
            </template>

            <template is="dom-if" if="[[ !selectable ]]">
                <div class="icon-container">
                    <iron-icon class="webhook-icon" icon="av:call-to-action"></iron-icon>
                </div>
            </template>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.title ]]</span>
            </div>

            <div class="actions">
                <template is="dom-if" if="[[ _url ]]">
                    Copy web hook url to clipboard <appsco-copy value="[[ _url ]]"></appsco-copy>
                </template>

                <template is="dom-if" if="[[ !_registered ]]">
                    <paper-button on-tap="_onRegisterItemAction">Register</paper-button>
                </template>

                <template is="dom-if" if="[[ _registered ]]">
                    <paper-button on-tap="_onUnregisterItemAction">Unregister</paper-button>
                </template>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-integration-webhook-item'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _registered: {
                type: Boolean,
                value: false
            },

            _url: {
                type: String
            }
        };
    }

    register(url) {
        this._registered = true;
        this._url = url;
    }

    unregister() {
        this._registered = false;
        this._url = null;
    }

    _onRegisterItemAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('register-item', {
            bubbles: true,
            composed: true,
            detail: {
                item: this.item
            }
        }));
    }

    _onUnregisterItemAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('unregister-item', {
            bubbles: true,
            composed: true,
            detail: {
                item: this.item
            }
        }));
    }
}
window.customElements.define(AppscoIntegrationWebhookItem.is, AppscoIntegrationWebhookItem);
