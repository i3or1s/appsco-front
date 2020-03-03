import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationRuleItem extends mixinBehaviors([
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
                background-color: var(--rule-icon-background-color, var(--account-initials-background-color));
                position: relative;
                @apply --layout-flex-none;
            }
            :host .rule-icon {
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
            :host([tablet-screen]) .item-basic-info, :host([tablet-screen]) .item-basic-info .info-label, :host([tablet-screen]) .item-basic-info .info-value {
                width: 40%;;
            }
            :host([mobile-screen]) .item-additional-info {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 900px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" on-tap="_onItemAction">

            <template is="dom-if" if="[[ selectable ]]">
                <div class="select-action" on-tap="_onSelectItemAction">

                    <div class="icon-container">
                        <iron-icon class="rule-icon" icon="hardware:device-hub"></iron-icon>
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
                    <iron-icon class="rule-icon" icon="hardware:device-hub"></iron-icon>
                </div>
            </template>

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
            </div>

            <div class="actions">
                <paper-button on-tap="_onEditItemAction">Edit</paper-button>

                <template is="dom-if" if="[[ _isFromMethodLookup ]]">
                    <paper-button on-tap="_onRunItemAction">Run</paper-button>
                </template>
                
                <paper-button on-tap="_onRemoveItemAction">Remove</paper-button>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-integration-rule-item'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _isFromMethodLookup: {
                type: Boolean,
                computed: '_computeIsFromMethodLookup(item)'
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen)'
        ];
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.tabletScreen) {
                this._updateScreen();
            }
        });
    }

    _computeIsFromMethodLookup(rule) {
        return ('from_lookup' === rule.fromMethod);
    }

    _updateScreen() {
        this.updateStyles();
    }

    _onRunItemAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('run-item', {
            bubbles: true,
            composed: true,
            detail: {
                item: this.item
            }
        }));
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
window.customElements.define(AppscoIntegrationRuleItem.is, AppscoIntegrationRuleItem);
