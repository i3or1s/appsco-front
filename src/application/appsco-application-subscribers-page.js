import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '../components/application/appsco-application-subscribers.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationSubscribersPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --item-background-color: var(--body-background-color);
                --subscriber-initials-background-color: var(--body-background-color-darker);
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

        <paper-card heading="Subscribers" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">

                <appsco-application-subscribers id="appscoApplicationSubscribers" application="[[ application ]]" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" size="10" load-more="">
                </appsco-application-subscribers>
            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-application-subscribers-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            account: {
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

    searchSubscribers(term) {
        this.$.appscoApplicationSubscribers.search(term);
    }

    setupPage() {
        this.dispatchEvent(new CustomEvent('enable-subscribers-search-action', { bubbles: true, composed: true }));
    }

    resetPage() {
        this.dispatchEvent(new CustomEvent('disable-subscribers-search-action', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoApplicationSubscribersPage.is, AppscoApplicationSubscribersPage);
