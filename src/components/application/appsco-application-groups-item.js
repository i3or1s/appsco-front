import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationGroupsItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                color: var(--primary-text-color);
                font-size: 14px;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .item {
                width: 100%;
                height: 70px;
                padding: 0 10px;
                margin-bottom: 10px;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #ffffff);
                border-radius: 3px;
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                transition: all 0.1s ease-out;
                @apply --appsco-application-groups-item;
            }
            .item:hover {
                @apply --shadow-elevation-4dp;
            }
            .group-title {
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
            .group-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            .group-basic-info {
                width: 220px;
                @apply --group-basic-info;
            }
            .group-basic-info .info-group, .group-basic-info {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --group-basic-info-values;
            }
            .group-status-info .info-group {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --group-status-info-values;
            }
            .info-group {
                font-size: 16px;
                height: auto;
                line-height: normal;
            }
            .info-group.preview {
                font-size: 14px;
                padding-top: 5px;
            }

        </style>

        <template is="dom-if" if="[[ preview ]]">
            <span class="info-group group-title preview">[[ group.name ]]</span>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">

                <div class="group-info group-basic-info">
                    <span class="info-group group-title">[[ group.name ]]</span>
                </div>

                <div class="actions">
                    <paper-button on-tap="_onRemoveAction">Remove</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-application-groups-item'; }

    static get properties() {
        return {
            group: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            application: {
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

    _onRemoveAction(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('remove-from-group', {
            bubbles: true,
            composed: true,
            detail: {
                group: this.group,
                application: this.application
            }
        }));
    }
}
window.customElements.define(AppscoApplicationGroupsItem.is, AppscoApplicationGroupsItem);
