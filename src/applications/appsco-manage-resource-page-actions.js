import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageResourcePageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
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
            appsco-search {
                max-width: 200px;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            .search-assignees-action {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                margin-right: 10px;
            }
            .global-page-actions {
                @apply --manage-page-global-actions;
            }
            :host .info-action {
                margin-left: 10px;
                margin-right: 0;
                display: none;
            }
            :host .back-action {
                margin-right: 0;
            }
            :host([tablet-screen]) .info-action {
                display: block;
            }
            :host .advanced-settings-button {
                @apply --account-advanced-settings-action;
                @apply --primary-button;
                margin-right: 10px;
            }
            :host .advanced-settings-button[active] {
                @apply --shadow-elevation-2dp;
                @apply --account-advanced-settings-action-active;
                @apply --primary-button-active;
            }
            :host .advanced-settings-button[disabled] {
                opacity: 0.5;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <template is="dom-if" if="[[ _searchAssigneesActive ]]">
            <div class="search-assignees-action">

                <appsco-search id="appscoSearch" label="Search assignees" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>
            </div>
        </template>

        <div class="global-page-actions">

            <template is="dom-if" if="[[ !resourceAdmin ]]">
                <paper-button id="advancedSettingsAction" class="advanced-settings-button" toggles="" on-tap="_onAdvancedSettingsAction">Advanced settings</paper-button>
            </template>

            <paper-icon-button class="back-action" icon="arrow-back" title="Back" on-tap="_backToApplications"></paper-icon-button>

            <paper-icon-button class="info-action" icon="info-outline" title="Resource section" on-tap="_onResourceAction"></paper-icon-button>
        </div>
`;
    }

    static get is() { return 'appsco-manage-resource-page-actions'; }

    static get properties() {
        return {
            _searchAssigneesActive: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if advanced action(s) should be visible or not.
             */
            advanced: {
                type: Boolean,
                value: false
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

    ready(){
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

    enableAssigneesSearchAction() {
        this._searchAssigneesActive = true;
    }

    disableAssigneesSearchAction() {
        this._onSearchClear();
        this._searchAssigneesActive = false;
    }

    _backToApplications() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    _onResourceAction() {
        this.dispatchEvent(new CustomEvent('resource-section', { bubbles: true, composed: true }));
    }

    _onSearch(event) {
        this.dispatchEvent(new CustomEvent('search-assignees', {
            bubbles: true,
            composed: true,
            detail: {
                term: event.detail.term
            }
        }));
    }

    _onSearchClear() {
        this._resetAssigneesSearch();

        this.dispatchEvent(new CustomEvent('search-assignees-clear', {
            bubbles: true,
            composed: true,
            detail: {
                term: ''
            }
        }));
    }

    _resetAssigneesSearch() {
        if (this._searchAssigneesActive) {
            this.shadowRoot.getElementById('appscoSearch').reset();
        }
    }

    resetApplicationAssigneesPageActions() {
        this._resetAssigneesSearch();
    }

    /**
     * Called on account advanced settings action.
     *
     * @private
     */
    _onAdvancedSettingsAction() {
        /**
         * Fired when advanced settings action is triggered.
         *
         * @event advanced-settings
         */
        this.dispatchEvent(new CustomEvent('advanced-settings', {
            bubbles: true,
            composed: true,
            detail: {
                showAdvanced: this.shadowRoot.getElementById('advancedSettingsAction').active
            }
        }));
    }

    /**
     * Disables advanced settings action.
     */
    disableAdvancedSettings() {
        this.shadowRoot.getElementById('advancedSettingsAction').disabled = true;
    }

    /**
     * Enables advanced settings action.
     */
    enableAdvancedSettings() {
        this.shadowRoot.getElementById('advancedSettingsAction').disabled = false;
    }

    resetAdvancedSettingsAction() {
        this.shadowRoot.getElementById('advancedSettingsAction').active = false;
    }
}
window.customElements.define(AppscoManageResourcePageActions.is, AppscoManageResourcePageActions);
