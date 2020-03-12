import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '../components/application/appsco-application-log.js';
import '../components/components/appsco-list-item.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationLogPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --application-log-item-first: {
                    border-top: none;
                };
                --application-log-item: {
                    padding: 20px 16px 10px 6px;
                }
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
            appsco-application-log {
                --paper-button: {
                     padding: 6px 12px;
                 };
            }
        </style>

        <paper-card heading="Resource log" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">

                <appsco-application-log size="10" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" load-more="" company="[[ company ]]">
                </appsco-application-log>

            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-application-log-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String
            },

            company: {
                type: Boolean,
                value: false
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
                toPage: this
            }, {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 600
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
}
window.customElements.define(AppscoApplicationLogPage.is, AppscoApplicationLogPage);
