import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './appsco-company-transfer-token.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyTransferTokenPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --appsco-copy-action: {
                     width: 32px;
                     height: 32px;
                     padding: 8px;
                     margin: 0;
                 };
            }
            paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    color: var(--primary-text-color);
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Transfer token" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onBack"></paper-icon-button>

            <div class="card-content layout vertical">

                <appsco-company-transfer-token id="appscoCompanyTransferToken" authorization-token="[[ authorizationToken ]]" transfer-token-api="[[ transferTokenApi ]]" partners-api-url="[[ partnersApiUrl ]]" send-transfer-token-api="[[ sendTransferTokenApi ]]" api-errors="[[ apiErrors ]]"></appsco-company-transfer-token>

            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-company-transfer-token-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            transferTokenApi: {
                type: String
            },

            sendTransferTokenApi: {
                type: String
            },

            partnersApiUrl: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            animationConfig: {
                type: Object
            },

            sharedElements: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': [{
                name: 'hero-animation',
                id: 'hero',
                toPage: this,
                timing: {
                    duration: 300
                }
            }, {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }],
            'exit': {
                name: 'slide-right-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };
        this.sharedElements = {
            'hero': this.$.card
        };
    }

    _onBack() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    resetPage() {
        this.$.appscoCompanyTransferToken.reset();
    }
}
window.customElements.define(AppscoCompanyTransferTokenPage.is, AppscoCompanyTransferTokenPage);
