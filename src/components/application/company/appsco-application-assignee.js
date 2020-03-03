import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-image/iron-image.js';
import '../../account/appsco-account-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAssignee extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: none;
                color: var(--primary-text-color);
            @apply --appsco-application-assignee;
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
            :host .assignee {
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
            @apply --appsco-application-assignee;
            }
            :host .assignee:hover {
            @apply --shadow-elevation-4dp;
            }
            appsco-account-image.full-account-image {
                --account-image: {
                    width: 52px;
                    height: 52px;
                };
            }
            :host .assignee-info {
            @apply --layout-vertical;
            @apply --layout-start;
                padding: 0 10px;
            }
            :host .assignee-basic-info {
                width: 220px;
            }
            :host .assignee-basic-info .info-label, :host .assignee-basic-info .info-value {
                width: 226px;
                @apply --paper-font-common-nowrap;
            }
            :host .assignee-security-info {
                border-left: 1px solid var(--divider-color);
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
            :host .assignee-name {
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
            :host paper-button[disabled] {
                background: transparent;
            }
        </style>

        <template is="dom-if" if="[[ preview ]]">
            <appsco-account-image account="[[ assignee ]]" class="preview-account-image"></appsco-account-image>
            <paper-tooltip position="right">[[ assignee.display_name ]]<br>[[ assignee.email ]]</paper-tooltip>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="assignee" on-tap="_onAssigneeAction">
                <appsco-account-image account="[[ assignee ]]" class="full-account-image"></appsco-account-image>

                <div class="assignee-info assignee-basic-info">
                    <span class="info-label assignee-name">[[ assignee.display_name ]]</span>
                    <span class="info-value">[[ assignee.email ]]</span>
                </div>

                <template is="dom-if" if="[[ _securityScorePermission ]]">
                    <div class="assignee-info assignee-security-info">
                        <span class="info-label">Security</span>
                        <span class="info-value">Score: [[ assignee.application_security.score ]]</span>
                    </div>
                </template>

                <div class="actions">
                    <template is="dom-if" if="[[ _individualClaims ]]">
                        <paper-button class="action-button" on-tap="_onClaimsAction">Claims</paper-button>
                    </template>

                    <paper-button class="action-button" on-tap="_onRevokeAction">Revoke</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-application-assignee'; }

    static get properties() {
        return {
            /**
             * Application which is assigned to account.
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            infoSection: {
                type: Boolean,
                value: function () {
                    return true;
                }
            },

            /**
             * Assignee to display.
             *
             * @type {Object}
             */
            assignee: {
                type: Object
            },

            preview: {
                type: Boolean,
                value: false
            },

            _individualClaims: {
                type: Boolean,
                computed: '_computeIndividualClaims(application)'
            },

            _securityScorePermission: {
                type: Boolean,
                computed: '_computeSecurityScorePermission(application, infoSection)'
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

    _computeIndividualClaims(application) {
        return application.claim_type === 'individual';
    }

    _computeSecurityScorePermission(application, infoSection) {
        return (-1 < ['unpw', 'item'].indexOf(application.auth_type)) && infoSection;
    }

    _onAssigneeAction() {
        this.dispatchEvent(new CustomEvent('assignee', {
            bubbles: true,
            composed: true,
            detail: {
                assignee: this.assignee
            }
        }));
    }

    _onClaimsAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('assignee-claims', {
            bubbles: true,
            composed: true,
            detail: {
                assignee: this.assignee
            }
        }));
    }

    _onRevokeAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('revoke-assignee', {
            bubbles: true,
            composed: true,
            detail: {
                assignee: this.assignee
            }
        }));
    }
}
window.customElements.define(AppscoApplicationAssignee.is, AppscoApplicationAssignee);
