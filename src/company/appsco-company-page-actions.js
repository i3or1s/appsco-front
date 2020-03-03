import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-button/paper-button.js';
import '../components/components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;

                --application-action-icon-color: var(--app-primary-color);
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
            .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --company-action;
            }
            appsco-search {
                max-width: 200px;
            }
            .global-page-actions {
                border-left: 1px solid var(--divider-color);
                margin-left: 16px;
                padding-left: 10px;
                display: none;
            }
            .add-action {
                @apply --primary-button;
            }
            :host([tablet-screen]) .global-page-actions {
                display: block;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <template is="dom-if" if="[[ _domainsActionsActive ]]">
            <div class="actions">
                <paper-button class="add-action" id="companySettingsAddDomain" on-tap="_onAddDomainAction">Add domain</paper-button>
            </div>
        </template>

        <template is="dom-if" if="[[ _groupsActionsActive ]]">
            <div class="actions">
                <div class="action">
                    <appsco-search id="appscoSearch" label="Search groups" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>
                </div>
            </div>
        </template>

        <div class="global-page-actions">
            <paper-icon-button class="info-action" icon="info-outline" title="Resource section" on-tap="_onResourceAction"></paper-icon-button>
        </div>
`;
    }

    static get is() { return 'appsco-company-page-actions'; }

    static get properties() {
        return {
            _domainsActionsActive: {
                type: Boolean,
                value: false
            },

            _groupsActionsActive: {
                type: Boolean,
                value: false,
                observer: '_onGroupsActionsActiveChanged'
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

    showDomainsPageActions() {
        this._domainsActionsActive = true;
    }

    hideDomainsPageActions() {
        this._domainsActionsActive = false;
    }

    showGroupsPageActions() {
        this._groupsActionsActive = true;
    }

    hideGroupsPageActions() {
        this._onSearchClear();
        this._groupsActionsActive = false;
    }

    _onGroupsActionsActiveChanged(active) {
        if (active) {
            this.hideDomainsPageActions();
        }
    }

    _onResourceAction() {
        this.dispatchEvent(new CustomEvent('resource-section', { bubbles: true, composed: true }));
    }

    _onAddDomainAction() {
        this.dispatchEvent(new CustomEvent('add-domain', { bubbles: true, composed: true }));
    }

    _onSearch(event) {
        this.dispatchEvent(new CustomEvent('search-groups', {
            bubbles: true,
            composed: true,
            detail: {
                term: event.detail.term
            }
        }));
    }

    _onSearchClear() {
        this._resetSearch();

        this.dispatchEvent(new CustomEvent('search-groups-clear', {
            bubbles: true,
            composed: true,
            detail: {
                term: ''
            }
        }));
    }

    _resetSearch() {
        if (this._groupsActionsActive) {
            this.shadowRoot.getElementById('appscoSearch').reset();
        }
    }
}
window.customElements.define(AppscoCompanyPageActions.is, AppscoCompanyPageActions);
