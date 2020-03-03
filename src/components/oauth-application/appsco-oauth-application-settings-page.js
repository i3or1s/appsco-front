import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './appsco-edit-oauth-application-form.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoOAuthApplicationSettingsPage extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
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
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Settings" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content layout vertical">
                <appsco-edit-oauth-application-form id="appscoEditOAuthApplicationForm" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-edit-oauth-application-form>
            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-oauth-application-settings-page'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            authorizationToken: {
                type: String,
                value: ''
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

    setPage() {
        this.$.appscoEditOAuthApplicationForm.initialize();
    }

    resetPage() {
        this.$.appscoEditOAuthApplicationForm.reset();
    }

    _onClosePageAction() {
        this.resetPage();
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoOAuthApplicationSettingsPage.is, AppscoOAuthApplicationSettingsPage);
