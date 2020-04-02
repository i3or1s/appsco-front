import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/account/appsco-account-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyAccountPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;

                --account-advanced-settings-action: {
                     @apply --primary-button;
                 };

                --account-advanced-settings-action-active: {
                     @apply --primary-button-active;
                 };
            }
            :host > * {
                height: 100%;
            }
            .global-page-actions {
                padding-left: 10px;
                margin-left: 16px;
                border-left: 1px solid var(--divider-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            :host .back-action {
                margin-right: 10px;
            }
            :host .info-action {
                display: none;
            }
            :host([tablet-screen]) .info-action {
                display: block;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <appsco-account-actions id="appscoAccountActions" advanced-actions=""></appsco-account-actions>

        <div class="global-page-actions">
            <paper-icon-button class="back-action" icon="arrow-back" title="Back" on-tap="_backToHome"></paper-icon-button>

            <paper-icon-button class="info-action" icon="info-outline" title="Resource section" on-tap="_onResourceAction"></paper-icon-button>
        </div>
`;
    }

    static get is() { return 'appsco-company-account-page-actions'; }

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

    disableAdvancedSettings() {
        this.$.appscoAccountActions.disableAdvancedSettings();
    }

    enableAdvancedSettings() {
        this.$.appscoAccountActions.enableAdvancedSettings();
    }

    hideAdvancedSettings() {
        this.$.appscoAccountActions.hideAdvancedSettings();
    }

    showAdvancedSettings() {
        this.$.appscoAccountActions.showAdvancedSettings();
    }

    _backToHome() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    _onResourceAction() {
        this.dispatchEvent(new CustomEvent('resource-section', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoCompanyAccountPageActions.is, AppscoCompanyAccountPageActions);
