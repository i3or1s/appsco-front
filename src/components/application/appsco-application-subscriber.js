import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-image/iron-image.js';
import '../account/appsco-account-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationSubscriber extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: none;
            @apply --appsco-application-subscriber;
            }
            appsco-account-image.preview-account-image {
                --account-image: {
                    width: 28px;
                    height: 28px;
                };
                --account-initials-background-color: var(--subscriber-initials-background-color);
                --account-initials-font-size: 12px;
            }
            paper-tooltip {
            --paper-tooltip: {
                 font-size: 11px;
                 line-height: 12px;
             };
            }
            :host .subscriber {
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --shadow-elevation-2dp;
                width: 100%;
                height: 70px;
                padding: 0 10px;
                box-sizing: border-box;
                border-radius: 3px;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #fafafa);
                cursor: pointer;
            @apply --appsco-application-subscriber;
            }
            :host .subscriber:hover {
            @apply --shadow-elevation-4dp;
            }
            appsco-account-image.full-account-image {
                --account-image: {
                    width: 52px;
                    height: 52px;
                };
                --account-initials-background-color: var(--subscriber-initials-background-color);
            }
            :host .subscriber-info {
            @apply --layout-vertical;
            @apply --layout-start;
                padding: 0 10px;
            }
            :host .subscriber-basic-info {
                width: 220px;
            }
            :host.subscriber-basic-info .info-label, :host .subscriber-basic-info .info-value {
                width: 226px;
            @apply --paper-font-common-nowrap;
            }
            :host .info-label {
                font-size: 16px;
                height: auto;
                line-height: normal;
            }
            :host .info-value {
                display: block;
                font-size: 12px;
            }
            :host .subscriber-name {
                display: block;
            @apply --paper-font-common-base;
                font-size: 16px;
                font-weight: 400;
                overflow: hidden;
            }
            :host .actions {
            @apply --layout-horizontal;
            @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
                display: none;
            }
            :host .actions[revoke] {
            @apply --layout-horizontal;
            @apply --layout-center;
            }
            :host .action-button {
            @apply --paper-font-common-base;
            @apply --paper-font-common-nowrap;
                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.018em;
                line-height: 18px;
                text-transform: uppercase;
            }
        </style>

        <template is="dom-if" if="[[ preview ]]">
            <appsco-account-image account="[[ subscriber ]]" class="preview-account-image"></appsco-account-image>
            <paper-tooltip position="right">[[ subscriber.name ]]<br>[[ subscriber.email ]]</paper-tooltip>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="subscriber">
                <appsco-account-image account="[[ subscriber ]]" class="full-account-image"></appsco-account-image>

                <div class="subscriber-info subscriber-basic-info">
                    <span class="info-label subscriber-name">[[ subscriber.name ]]</span>
                    <span class="info-value">[[ subscriber.email ]]</span>
                </div>

                <div class="actions" revoke\$="[[ !_owner ]]">
                    <paper-button class="action-button" on-tap="_onRevokeAccessAction">Revoke</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-application-subscriber'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            subscriber: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            preview: {
                type: Boolean,
                value: false
            },

            _owner: {
                type: Boolean,
                computed: '_computeOwner(subscriber, account)'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 100
                }
            }
        };

        beforeNextRender(this, function() {
            this.style.display = 'inline-block';
        });

        afterNextRender(this, function() {
            this.playAnimation('entry');
        });
    }

    _computeOwner(subscriber, account) {
        return account && subscriber.email === account.email;
    }

    _onRevokeAccessAction() {
        this.dispatchEvent(new CustomEvent('subscription-revoke', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application,
                account: this.subscriber
            }
        }));
    }
}
window.customElements.define(AppscoApplicationSubscriber.is, AppscoApplicationSubscriber);
