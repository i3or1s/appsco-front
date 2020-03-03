import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '../account/appsco-account-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountCard extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
            @apply --appsco-account-card;
            }
            .account-card {
            @apply --shadow-elevation-2dp;
            @apply --layout-horizontal;
            @apply --layout-center;
                width: 142px;
                height: 24px;
                line-height: 24px;
                padding: 4px;
                font-size: 13px;
                cursor: pointer;
                position: relative;
                border-radius: 3px;
            @apply --account-card;
            }
            appsco-account-image {
                --account-image: {
                    width: 22px;
                    height: 22px;
                    margin-right: 4px;
                };
                --account-initials-font-size: 12px;
            }
            .account-name {
            @apply --layout-flex;
            @apply --paper-font-common-nowrap;
            @apply --account-name;
            }
            .clear-icon {
                width: 14px;
                height: 14px;
                position: absolute;
                top: 2px;
                right: 0;
            }
            paper-tooltip {
                top: inherit !important;
                bottom: -24px !important;
            --paper-tooltip: {
                 font-size: 11px;
             };
            }
        </style>

        <div class="account-card">
            <appsco-account-image account="[[ account ]]"></appsco-account-image>
            <span class="account-name">[[ account.name ]]</span>

            <paper-tooltip position="bottom">
                [[ account.email ]]
            </paper-tooltip>

            <template is="dom-if" if="[[ removeAction ]]">
                <iron-icon icon="icons:clear" class="clear-icon"></iron-icon>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-account-card'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            removeAction: {
                type: Boolean,
                value: false
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
                    duration: 100
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        beforeNextRender(this, function() {
            this.style.display = 'flex';
        });

        afterNextRender(this, function() {
            this._addListeners();
            this.playAnimation('entry');
        });
    }

    _addListeners() {
        this.addEventListener('tap', this._onTap);
        this.addEventListener('neon-animation-finish', this._onAnimationFinish);
    }

    _onTap() {
        this.playAnimation('exit', {
            exit: true
        });
    }

    _onAnimationFinish(event) {
        if (event.detail.exit) {
            this.dispatchEvent(new CustomEvent('selected', {
                bubbles: true,
                composed: true,
                detail: {
                    account: this.account
                }
            }));
        }
    }
}
window.customElements.define(AppscoAccountCard.is, AppscoAccountCard);
