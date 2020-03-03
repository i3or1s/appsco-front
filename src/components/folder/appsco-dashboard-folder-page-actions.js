import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '../page/appsco-page-global.js';
import '../components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDashboardFolderPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            :host .actions-container {
                margin-right: -10px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
            }
            :host .back-action-container {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .back-action {
                margin-right: 0;
                @apply --layout-flex-none;
            }
            appsco-search {
                max-width: 200px;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            :host > * {
                height: 100%;
            }
            :host([mobile-screen]) appsco-page-global {
                margin-left: 10px;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <div class="actions-container">
            <div class="action">
                <appsco-search id="appscoSearch" label="Search resources"></appsco-search>
            </div>
        </div>

        <appsco-page-global id="appscoPageGlobal" info=""></appsco-page-global>

        <div class="back-action-container">
            <paper-icon-button class="back-action" icon="arrow-back" title="Back" on-tap="_onBackToAction"></paper-icon-button>
        </div>
`;
    }

    static get is() { return 'appsco-dashboard-folder-page-actions'; }

    static get properties() {
        return {
            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    delay: 200,
                    duration: 300
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
            if (this.mobileScreen || this.tabletScreen) {
                this.updateStyles();
            }
        });
    }

    resetPage() {
        this.$.appscoSearch.reset();
    }

    _updateScreen() {
        this.updateStyles();
    }

    _onBackToAction() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoDashboardFolderPageActions.is, AppscoDashboardFolderPageActions);
