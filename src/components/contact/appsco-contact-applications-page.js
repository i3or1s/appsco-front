import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './appsco-contact-applications.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContactApplicationsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --appsco-contact-application: {
                     background-color: var(--body-background-color);
                 };
            }
            :host paper-card {
                @apply --full-page-paper-card;
            }
            .page-close-action {
                @apply --page-close-action;
            }
            .info p {
                margin-top: 5px;
                margin-bottom: 0;
            }
            .info {
                margin-bottom: 20px;
            }
        </style>

        <paper-card heading="Shared resources" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">

                <template is="dom-if" if="[[ !_applicationsEmpty ]]">
                    <div class="info">
                        <p>List of all company resources that are shared to this contact.</p>
                    </div>
                </template>

                <appsco-contact-applications id="appscoContactApplications" contact="[[ contact ]]" authorization-token="[[ authorizationToken ]]" load-more="" size="10" on-applications-empty="_onApplicationsEmpty" on-applications-loaded="_onApplicationsLoaded"></appsco-contact-applications>

            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-contact-applications-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            contact: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _applicationsEmpty: {
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

    ready() {
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

    _onApplicationsEmpty() {
        this._applicationsEmpty = true;
    }

    _onApplicationsLoaded() {
        this._applicationsEmpty = false;
    }

    _back() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    reloadApplications() {
        this.$.appscoContactApplications.reload();
    }
}
window.customElements.define(AppscoContactApplicationsPage.is, AppscoContactApplicationsPage);
