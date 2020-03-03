import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountOrgunitItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: none;
                padding: 10px 6px;
                border-top: 1px solid var(--divider-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --appsco-account-orgunit-item;
            }
            :host .info {
                @apply --layout-vertical;
                @apply --layout-flex;
            }
            :host .info-lead {
                font-size: 14px;
            }
            :host .info-additional {
                font-size: 12px;
                opacity: 0.8;
            }
            :host .actions paper-button {
                padding: 2px 4px;
                font-size: 12px;
                opacity: 0.6;
            }
        </style>

        <div class="info">
            <div class="info-lead">
                [[ item.name ]]
            </div>
            <div class="info-additional">
                [[ item.description ]]
            </div>
        </div>

        <div class="actions">
            <paper-button class="remove-button" on-tap="_onRemoveFromOrgunit">Remove</paper-button>
        </div>
`;
    }

    static get is() { return 'appsco-account-orgunit-item'; }

    static get properties() {
        return {
            item: {
                type: Object
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
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
            this.style.display = 'flex';
        });

        afterNextRender(this, function() {
            this.playAnimation('entry');
        });
    }

    _onRemoveFromOrgunit() {
        this.dispatchEvent(new CustomEvent('remove-from-orgunit', {
            bubbles: true,
            composed: true,
            detail: {
                orgunit: this.item,
                account: this.account
            }
        }));
    }
}
window.customElements.define(AppscoAccountOrgunitItem.is, AppscoAccountOrgunitItem);
