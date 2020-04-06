import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomersActions extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                margin-right: -10px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                @apply --appsco-customers-actions;
            }
            appsco-search {
                max-width: 200px;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --customers-action;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            :host .bulk-action {
                display: none;
            }
            :host .add-action {
                @apply --add-item-action;
            }
            :host .bulk-action[hidden] {
                display: none !important;
            }
            :host .import-action {
                @apply --import-action;
            }
            :host .export-action {
                @apply --export-action;
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            .item-action-list {
                position: absolute;
                top: 34px;
                right: 0;
                width: 200px;
                @apply --shadow-elevation-2dp;
                opacity: 0;
                visibility: hidden;
                transform: scale(1, 0.6);
                transform-origin: top center;
                transition: all 0.1s linear;
                @apply --item-action-list;

            }
            :host([_import-actions-visible]) .item-action-list {
                opacity: 1;
                visibility: visible;
                transform: scale(1, 1);
                transform-origin: top center;
                transition: all 0.2s linear;
            }
            .item-icon {
                width: 18px;
                height: 18px;
                margin-right: 8px;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            :host paper-tooltip {
                top: 100% !important;
                font-weight: 500;
                min-width: 100px;
                text-align: center;
                @apply --customer-actions-tooltip;
            }
            :host([tablet-screen]) .removable-button {
                display: none;
            }
            :host([mobile-screen]) .action-search {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <div class="action action-search flex-none">

            <appsco-search id="appscoSearch" label="Search customers"></appsco-search>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="addPartnerAdminAction" icon="maps:person-pin" alt="Add partner admin" on-tap="_onAddPartnerAdmin"></paper-icon-button>
            <paper-tooltip for="addPartnerAdminAction" position="bottom">Add partner admin</paper-tooltip>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="removeCustomerAction" icon="icons:delete" alt="Remove customer" on-tap="_onRemoveCustomersAction"></paper-icon-button>
            <paper-tooltip for="removeCustomerAction" position="bottom">Remove customer</paper-tooltip>
        </div>

        <div class="action bulk-select-all flex-none">
            <paper-icon-button id="selectAllAction" icon="icons:done-all" alt="Select all" on-tap="_onSelectAllAction"></paper-icon-button>
            <paper-tooltip for="selectAllAction" position="bottom">Select all</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-button class="export-action removable-button" on-tap="_onExportToCsvAction">Export to CSV</paper-button>
        </div>

        <div class="action flex-none">
            <paper-button id="importAction" class="import-action removable-button" on-tap="_onImportAction">Import from CSV</paper-button>

            <paper-listbox id="actionList" class="item-action-list" on-iron-select="_onImportActionItemSelect">

                <template is="dom-repeat" items="[[ _actionList ]]">
                    <paper-item value="[[ item.value ]]">
                        <iron-icon icon="[[ item.icon ]]" class="item-icon"></iron-icon>
                        [[ item.name ]]</paper-item>
                </template>
            </paper-listbox>
        </div>

        <div class="action flex-none">
            <paper-button class="add-action" on-tap="_onAddAction">Add customer</paper-button>
        </div>
`;
    }

    static get is() { return 'appsco-customers-actions'; }

    static get properties() {
        return {
            _importActionsVisible: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _actionList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: 'import-customers',
                            name: 'Customers',
                            icon: 'icons:social:domain'
                        },
                        {
                            value: 'import-customer-resources',
                            name: 'Resources',
                            icon: 'icons:apps'
                        }
                    ]
                }
            },

            _bulkActions: {
                type: Boolean,
                value: false,
                observer: '_onBulkActionsChanged'
            },

            _bulkSelectAll: {
                type: Boolean,
                value: true,
                observer: '_onBulkSelectAllChanged'
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
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
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: [],
                nodeDelay: 50,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'cascaded-animation',
                animation: 'fade-out-animation',
                nodes: [],
                nodeDelay: 0,
                timing: {
                    duration: 200
                }
            }
        };

        afterNextRender(this, function() {
            this._addListeners();
        });

    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
        gestures.add(document, 'tap', this._handleDocumentClick.bind(this));
    }

    /**
     * Evaluates if item is in given path.
     *
     * @param {HTMLElement} element The element to be evaluated.
     * @param {Array<HTMLElement>=} path Elements in path to be checked against item element.
     * @return {Boolean}
     *
     * @private
     */
    _isInPath(path, element) {
        path = path || [];

        for (let i = 0; i < path.length; i++) {
            if (path[i] === element) {
                return true;
            }
        }

        return false;
    }

    /**
     * Listens for click outside import drop-down.
     * @private
     */
    _handleDocumentClick(event) {
        const path = dom(event).path;

        if (!this._isInPath(path, this.$.importAction)) {
            this._importActionsVisible = false;
        }
    }

    reset() {
        this.resetActions();
    }

    resetActions() {
        this.$.appscoSearch.reset();
        this.hideBulkActions();
    }

    _onAddAction() {
        this.dispatchEvent(new CustomEvent('add-customer', { bubbles: true, composed: true }));
    }

    _onSelectAllAction() {
        this.dispatchEvent(new CustomEvent('select-all-customers', { bubbles: true, composed: true }));
    }

    _onRemoveCustomersAction() {
        this.dispatchEvent(new CustomEvent('remove-customers', { bubbles: true, composed: true }));
    }

    _onAddPartnerAdmin () {
        this.dispatchEvent(new CustomEvent('add-partner-admin', { bubbles: true, composed: true }));
    }

    showBulkActions () {
        this._bulkActions = true;
    }

    hideBulkActions () {
        this._bulkActions = false;
    }

    _onBulkActionsChanged () {
        const bulkActions = dom(this.root).querySelectorAll('.bulk-action');

        if (this.animationConfig) {
            this.animationConfig.entry.nodes = bulkActions;
            this.animationConfig.exit.nodes = bulkActions;
        }

        if (this._bulkActions) {
            const length = bulkActions.length;

            for (let i = 0; i < length; i++) {
                bulkActions[i].style.display = 'flex';
            }

            this.playAnimation('entry');
        }
        else {
            this.playAnimation('exit');
        }
    }

    showBulkSelectAll() {
        this._bulkSelectAll = true;
    }

    hideBulkSelectAll() {
        this._bulkSelectAll = false;
    }

    _onBulkSelectAllChanged () {
        const bulkSelectAll = dom(this.root).querySelectorAll('.bulk-select-all');
        if (this._bulkSelectAll) {
            bulkSelectAll[0].style.display = 'block';
        }else {
            bulkSelectAll[0].style.display = 'none';
        }
    }

    _onNeonAnimationFinish() {
        if (!this._bulkActions) {
            const bulkActions = dom(this.root).querySelectorAll('.bulk-action'),
                length = bulkActions.length;

            for (let i = 0; i < length; i++) {
                bulkActions[i].style.display = 'none';
            }
        }
    }

    _onImportAction() {
        this._toggleActionList();
    }

    _toggleActionList() {
        this._importActionsVisible = !this._importActionsVisible;
    }

    _onImportActionItemSelect(event) {
        this.dispatchEvent(new CustomEvent(event.detail.item.value, { bubbles: true, composed: true }));

        this._importActionsVisible = false;
        this.shadowRoot.getElementById('actionList').selected = -1;
    }

    _onExportToCsvAction() {
        this.dispatchEvent(new CustomEvent('export-customers', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoCustomersActions.is, AppscoCustomersActions);
