import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '../account/appsco-account-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyPartnerAdminItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                color: var(--primary-text-color);
            }
            appsco-account-image.preview-account-image {
                --account-image: {
                    width: 28px;
                    height: 28px;
                };
                --account-initials-background-color: var(--partner-admin-initials-background-color);
                --account-initials-font-size: 12px;
            }
            appsco-account-image.full-account-image {
                --account-image: {
                    width: 52px;
                    height: 52px;
                };
                --account-initials-background-color: var(--partner-admin-initials-background-color);
            }
            paper-tooltip {
                --paper-tooltip: {
                    font-size: 11px;
                    line-height: 12px;
                };
            }
            .item {
                width: 100%;
                height: 70px;
                padding: 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #fff);
                border-radius: 3px;
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                transition: all 0.1s ease-out;
                @apply --appsco-company-partner-admin-item;
            }
            .item:hover {
                @apply --shadow-elevation-4dp;
            }
            .account-title {
                display: block;
                height: 32px;
                line-height: 16px;
                @apply --paper-font-common-base;
                font-size: 14px;
                font-weight: 400;
                overflow: hidden;
            }
            .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
            }
            paper-button {
                @apply --paper-font-common-base;
                @apply --paper-font-common-nowrap;

                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.018em;
                line-height: 18px;
                text-transform: uppercase;
            }
            paper-button[disabled] {
                background: transparent;
            }
            .account-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            .account-basic-info {
                width: 220px;
                @apply --account-basic-info;
            }
            .account-additional-info {
                border-left: 1px solid var(--divider-color);
                @apply --account-additional-info;
            }
            .account-basic-info .info-label, .account-basic-info .info-value {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --account-basic-info-values;
            }
            .info-label {
                font-size: 16px;
                height: auto;
                line-height: normal;
            }
            .info-value {
                display: block;
                font-size: 12px;
            }
        </style>

        <template is="dom-if" if="[[ preview ]]">
            <appsco-account-image account="[[ partnerAdmin.account ]]" class="preview-account-image"></appsco-account-image>
            <paper-tooltip position="right">[[ partnerAdmin.account.display_name ]]<br>[[ partnerAdmin.account.email ]]</paper-tooltip>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">
                <appsco-account-image account="[[ partnerAdmin.account ]]" class="full-account-image"></appsco-account-image>

                <div class="account-info account-basic-info">
                    <span class="info-label account-title">[[ partnerAdmin.account.display_name ]]</span>
                    <span class="info-value">[[ partnerAdmin.account.email ]]</span>
                </div>

                <div class="actions">
                    <paper-button on-tap="_onRevokeAction">Revoke</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-partner-admin-item'; }

    static get properties() {
        return {
            customer: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            partnerAdmin: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
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
                    duration: 200
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

    _onRevokeAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('remove-partner-admin-from-customer', {
            bubbles: true,
            composed: true,
            detail: {
                customer: this.customer,
                partnerAdmin: this.partnerAdmin
            }
        }));
    }
}
window.customElements.define(AppscoCompanyPartnerAdminItem.is, AppscoCompanyPartnerAdminItem);
