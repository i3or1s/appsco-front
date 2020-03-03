import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../components/account/appsco-account-change-password.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountChangePasswordPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };
            }
            :host paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Change password" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">
                <appsco-account-change-password id="appscoAccountChangePassword" authorization-token="[[ authorizationToken ]]" account-change-password-api="[[ changePasswordApi ]]"></appsco-account-change-password>
            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-account-change-password-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String
            },

            /**
             * Change account password link.
             */
            changePasswordApi: {
                type: String
            },

            animationConfig: {
                type: Object
            },

            sharedElements: {
                type: Object
            }
        };
    }

    ready(){
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

    _back() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    setPage() {
        this.$.appscoAccountChangePassword.setUp();
    }

    resetPage() {
        this.$.appscoAccountChangePassword.reset();
    }
}
window.customElements.define(AppscoAccountChangePasswordPage.is, AppscoAccountChangePasswordPage);
