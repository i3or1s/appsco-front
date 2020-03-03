import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-policy-report-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPolicyReportPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            :host > * {
                height: 100%;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            .global-page-actions {
                @apply --manage-page-global-actions;
            }
            :host .back-action {
                margin-right: 0;
            }
            :host .resource-action {
                margin-left: 10px;
                margin-right: 0;
                display: none;
            }
            appsco-policy-report-actions {
                margin-right: 10px;
            }
            :host([tablet-screen]) .resource-action {
                display: block;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <appsco-policy-report-actions></appsco-policy-report-actions>

        <div class="global-page-actions">
            <paper-icon-button class="back-action" icon="arrow-back" title="Back" on-tap="_onBackToAction"></paper-icon-button>

            <paper-icon-button class="resource-action" icon="icons:filter-list" title="Resource section" on-tap="_onResourceSectionAction"></paper-icon-button>
        </div>
`;
    }

    static get is() { return 'appsco-policy-report-page-actions'; }

    static get properties() {
        return {
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

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    delay: 300,
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
    }

    _onBackToAction() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    _onResourceSectionAction() {
        this.dispatchEvent(new CustomEvent('resource-section', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoPolicyReportPageActions.is, AppscoPolicyReportPageActions);
