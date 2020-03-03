import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyIdpDomainItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                color: var(--primary-text-color);
                font-size: 14px;
            }
            .item {
                width: 100%;
                height: 70px;
                padding: 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #ffffff);
                border-radius: 3px;
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                transition: all 0.1s ease-out;
                @apply --appsco-company-idp-domain-item;
            }
            .item:hover {
                @apply --shadow-elevation-4dp;
            }
            .domain-title {
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
            .domain-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            .domain-basic-info {
                width: 220px;
                @apply --domain-basic-info;
            }
            .domain-status-info {
                border-left: 1px solid var(--divider-color);
                @apply --domain-status-info;
            }
            .domain-basic-info .info-label, .domain-basic-info .info-value {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --domain-basic-info-values;
            }
            .domain-status-info .info-label, .domain-status-info .info-value {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --domain-status-info-values;
            }
            .domain-status-info .info-label {
                color: var(--app-primary-color);
            }
            .domain-status-info .not-configured {
                color: var(--app-danger-color);
            }
            .info-label {
                font-size: 16px;
                height: auto;
                line-height: normal;
            }
            .info-label.preview {
                font-size: 14px;
            }
        </style>

        <template is="dom-if" if="[[ preview ]]">
            <span class="info-label domain-title preview">[[ domain.domain ]]</span>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">

                <div class="domain-info domain-basic-info">
                    <span class="info-label domain-title">[[ domain.domain ]]</span>
                </div>

                <div class="domain-info domain-status-info">
                    <template is="dom-if" if="[[ _domainHasIdpConfigured ]]">
                        <span class="info-label">Configured</span>
                    </template>

                    <template is="dom-if" if="[[ !_domainHasIdpConfigured ]]">
                        <span class="info-label not-configured">Not configured</span>
                    </template>
                </div>

                <div class="actions">
                    <paper-button class="manage-domain-action" on-tap="_onManageAction">Manage</paper-button>

                    <template is="dom-if" if="[[ _domainHasIdpConfigured ]]">
                        <paper-button on-tap="_onDeactivateAction">Deactivate</paper-button>
                    </template>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-idp-domain-item'; }

    static get properties() {
        return {
            domain: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onDomainChanged'
            },

            /**
             * Indicates if domain should be in preview mode rather then full detailed view.
             */
            preview: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            },

            _domainHasIdpConfigured: {
                type: Boolean,
                value: false
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
        beforeNextRender(this, function () {
            this.style.display = 'inline-block';
        });

        afterNextRender(this, function () {
            this.playAnimation('entry');
        });
    }

    _onDomainChanged(domain) {
        this._domainHasIdpConfigured = (domain && domain.hasIdp);
    }

    _onManageAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('manage', {
            bubbles: true,
            composed: true,
            detail: {
                domain: this.domain
            }
        }));
    }

    _onDeactivateAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('deactivate-domain-idp-settings', {
            bubbles: true,
            composed: true,
            detail: {
                domain: this.domain
            }
        }));
    }
}
window.customElements.define(AppscoCompanyIdpDomainItem.is, AppscoCompanyIdpDomainItem);
