import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPolicyInfo extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppLocalizeBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --appsco-policy-info;
                display: none;
            }
            :host .info {
                margin: 6px 0;
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-body1;
                @apply --policy-info-value;
            }
            :host .info p {
                margin: 0;
            }
        </style>

        <template is="dom-if" if="[[ _info ]]">
            <div class="info">
                <p>[[ _info ]]</p>
            </div>
        </template>

        <template is="dom-if" if="[[ _warning ]]">
            <div class="info">
                <p>
                    <strong>Warning:&nbsp;</strong>
                    [[ _warning ]]
                </p>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-policy-info'; }

    static get properties() {
        return {
            policy: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            language: {
                type: String,
                value: 'en'
            },

            _info: {
                type: String,
                computed: '_computeInfo(policy, "info")'
            },

            _warning: {
                type: String,
                computed: '_computeInfo(policy, "warning")'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get importMeta() {
        return import.meta;
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 500
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
            this.loadResources(this.resolveUrl('./data/policy-info.json'));
        });

        afterNextRender(this, function() {
            this._addListeners();
            this._showInfo();
        });
    }

    _addListeners() {
        this.addEventListener('policy-changed', this._onPolicyChanged);
    }

    _computeInfo(policy, type) {
        return policy.name ? (this.localize(policy.name.toLowerCase().replace(/ /g, '_') + '_' + type)) : '';
    }

    _onPolicyChanged() {
        this._showInfo();
    }

    _showInfo() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }
}
window.customElements.define(AppscoPolicyInfo.is, AppscoPolicyInfo);
