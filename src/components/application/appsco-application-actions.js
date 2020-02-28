/**
`appsco-application-actions`
Actions related to applications page: New Application, Search, Filter.
- New Application - adding new app <appsco-application-add>.
- Search: search added applications.
- Filter: filter added applications.


    <appsco-application-actions>
    </appsco-application-actions>

### Styling

`<appsco-application-actions>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--add-application-icon-color` | Color for add-application-button-icon | `{}`
`--appsco-application-actions` | Mixin for the root element | `{}`
`--application-action` | Mixin for the action div container | `{}`
`--add-item-action` | Mixin for add item action button | `{}`
`--application-actions-tooltip` | Mixin for action's tooltip | `{}`

@demo demo/appsco-application-actions.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/appsco-search.js';
import '../page/appsco-page-config-dropdown.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationActions extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
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
                @apply --appsco-application-actions;

                --paper-dropdown-menu-button: {
                    display: block;
                    padding: 0 0 0 8px;
                    @apply --applications-actions-paper-dropdown-menu-button;
                };
            }
            appsco-search {
                max-width: 200px;
            }
            paper-icon-button {
                color: var(--application-action-icon-color);
                --paper-icon-button-ink-color: var(--application-action-icon-color);
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --application-action;
            }
            :host .bulk-action {
                display: none;
            }
            :host([bulk-actions]) .bulk-action {
                display: flex;
            }
            :host .bulk-action[hidden] {
                display: none !important;
            }
            paper-dropdown-menu {
                --paper-input-container-underline: {
                    display: none;
                };
                --paper-input-container-underline-focus: {
                    display: none;
                };
                --paper-dropdown-menu-ripple: {
                    display: none;
                };
                --paper-input-container-input: {
                    vertical-align: middle;
                    cursor: pointer;
                    @apply --application-actions-paper-dropdown-menu-input;
                };
            }
            :host paper-listbox {
                @apply --paper-listbox;
                max-width: 230px;
                overflow: hidden;
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            :host .add-item-action {
                @apply --add-item-action;
                min-width: 100px;
            }
            :host .import-action {
                @apply --import-item-action;
                min-width: 100px;
            }
            .add-item-icon-button {
                display: none;
                @apply --add-item-icon-button;
            }
            .import-item-icon-button {
                display: none;
                @apply --import-item-icon-button;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            paper-tooltip {
                top: 100% !important;
                font-weight: 500;
                min-width: 110px;
                text-align: center;
                @apply --application-actions-tooltip;

                --paper-tooltip: {
                    font-size: 11px;
                };
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
            :host([_add-item-actions-visible]) .item-action-list {
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
            :host paper-icon-button.config-icon {
                color: #414042
            }
        </style>

        <template is="dom-if" if="[[ _showOptions ]]">
            <div class="action action-search flex-none">
                <appsco-search id="appscoSearch" label="Search resources"></appsco-search>
            </div>
        </template>

        <template is="dom-if" if="[[ _showOptions ]]">
            <template is="dom-if" if="[[ !company ]]">
                <div class="action flex-none">
                    <paper-dropdown-menu on-iron-activate="_onFilterItemsAction" horizontal-align="right" no-label-float="">
                        <paper-listbox id="filterItemsList" class="dropdown-content filter" selected="0" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _filterItems ]]">
                                <paper-item value\$="[[ item.value ]]" name\$="[[ item.name ]]">[[ item.name ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
            </template>
        </template>

        <template is="dom-if" if="[[ _showOptions ]]">

            <template is="dom-if" if="[[ company ]]">
                <div class="action bulk-action flex-none">
                    <paper-icon-button id="shareAction" icon="social:share" alt="Share applications" on-tap="_onShareAction"></paper-icon-button>
                    <paper-tooltip for="shareAction" position="bottom">Share</paper-tooltip>
                </div>

                <div class="action bulk-action flex-none">
                    <paper-icon-button id="removeAction" icon="icons:delete" alt="Delete applications" on-tap="_onRemoveAction"></paper-icon-button>
                    <paper-tooltip for="removeAction" position="bottom">Remove</paper-tooltip>
                </div>

                <div class="action bulk-select-all flex-none">
                    <paper-icon-button id="selectAllAction" icon="icons:done-all" alt="Select all" on-tap="_onSelectAllAction"></paper-icon-button>
                    <paper-tooltip for="selectAllAction" position="bottom">Select all</paper-tooltip>
                </div>
            </template>
        </template>

        <template is="dom-if" if="[[ _showOptions ]]">
            <template is="dom-if" if="[[ addingResourceAllowed ]]">
                <div class="action flex-none" id="addItemActionWrapper">
                    <paper-button id="addItemAction" class="add-item-action" on-tap="_onAddItemAction">Add</paper-button>
                    <paper-icon-button id="addItemActionIconButton" icon="icons:add-circle" class="add-item-icon-button" alt="Add item" on-tap="_onAddItemAction"></paper-icon-button>
                    <paper-tooltip for="addItemActionIconButton" position="bottom">Add resource</paper-tooltip>

                    <paper-listbox id="resourcesActionList" class="item-action-list" on-iron-select="_onAddItemActionSelect">

                        <template is="dom-repeat" items="[[ _actionList ]]">
                            <paper-item value="[[ item.value ]]" tpl="[[ item.tpl ]]">
                                <iron-icon icon="[[ item.icon ]]" class="item-icon"></iron-icon>
                                [[ item.name ]]</paper-item>
                        </template>
                    </paper-listbox>
                </div>
            </template>
        </template>

        <template is="dom-if" if="[[ _showOptions ]]">
            <template is="dom-if" if="[[ company ]]">
                <div class="action flex-none">
                    <paper-button class="import-action" icon="editor:publish" on-tap="_onImportAction">Import</paper-button>
                    <paper-icon-button id="importItemActionIconButton" icon="editor:publish" class="import-item-icon-button" alt="Import item" on-tap="_onImportAction"></paper-icon-button>
                    <paper-tooltip for="importItemActionIconButton" position="bottom">Import resource</paper-tooltip>
                </div>
            </template>
        </template>

        <div class="action flex-none">
            <paper-icon-button id="configAction" class="config-icon" icon="icons:settings" alt="Page Settings" on-tap="_onShowPageSettings"></paper-icon-button>

            <appsco-page-config-dropdown id="resourcePageConfigDropdown" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" page-config-api="[[ pageConfigApi ]]" page-config="[[ pageConfig ]]" page="[[ page ]]" option-hide-resource-section="[[ pageConfigOptionHideResourceSection ]]" option-display-list="[[ pageConfigOptionDisplayList ]]" option-sort="[[ pageConfigOptionSort ]]"></appsco-page-config-dropdown>
        </div>
`;
  }

  static get is() { return 'appsco-application-actions'; }

  static get properties() {
      return {
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

          pageConfigApi: {
              type: String
          },

          pageConfig: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          page: {
              type: String,
              value: ''
          },

          pageConfigOptionHideResourceSection: {
              type: Boolean,
              value: false
          },

          pageConfigOptionDisplayList: {
              type: Boolean,
              value: false
          },

          pageConfigOptionSort: {
              type: Boolean,
              value: false
          },

          _filterItems: {
              type: Array,
              value: function () {
                  return [
                      {
                          name: 'All items',
                          value: 0
                      },
                      {
                          name: 'My items',
                          value: 1
                      },
                      {
                          name: 'Shared with me',
                          value: 2
                      }];
              }
          },

          /**
           * Indicates if appsco-company actions should be available or not.
           * Currently, company actions are bulk action and Add application action.
           */
          company: {
              type: Boolean,
              value: false
          },

          addingResourceAllowed: {
              type: Boolean,
              value: true
          },

          /**
           * Indicates if bulk actions for applications are visible or not.
           * Used to show / hide bulk actions.
           */
          bulkActions: {
              type: Boolean,
              value: false,
              observer: '_onBulkActionsChanged'
          },

          _bulkSelectAll: {
              type: Boolean,
              value: true,
              observer: '_onBulkSelectAllChanged'
          },

          _showOptions: {
              type: Boolean,
              computed: '_computeShowOptions(resourceAdmin, company)'
          },

          resourceAdmin: {
              type: Boolean,
              value: false
          },

          _actionList: {
              type: Array,
              value: function () {
                  return [
                      {
                          value: 'catalogue-application',
                          name: 'Application',
                          icon: 'icons:list',
                          tpl: ''
                      },
                      {
                          value: 'link',
                          name: 'Link',
                          icon: 'icons:link',
                          tpl: '/api/v2/applications/28'
                      },
                      {
                          value: 'login',
                          name: 'Login',
                          icon: 'icons:input',
                          tpl: '/api/v2/applications/1493886244'
                      },
                      {
                          value: 'credit-card',
                          name: 'Credit Card',
                          icon: 'icons:credit-card',
                          tpl: '/api/v2/applications/1493886242'
                      },
                      {
                          value: 'software-licence',
                          name: 'Software Licence',
                          icon: 'communication:vpn-key',
                          tpl: '/api/v2/applications/1493886247'
                      },
                      {
                          value: 'passport',
                          name: 'Passport',
                          icon: 'icons:flight-takeoff',
                          tpl: '/api/v2/applications/1493886245'
                      },
                      {
                          value: 'secure-note',
                          name: 'Secure Note',
                          icon: 'editor:insert-drive-file',
                          tpl: '/api/v2/applications/1493886246'
                      }
                  ]
              }
          },

          _addItemActionsVisible: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          _searchDebounce: {
              type: Number,
              value: 0
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
          if (this.company) {
              this.unshift('_actionList', {
                  value: 'sso-application',
                  name: 'SSO Application',
                  icon: 'icons:apps',
                  tpl: ''
              });
          }
          gestures.add(document, 'tap', this._handleDocumentClick.bind(this));
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
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
          if (path[i] == element) {
              return true;
          }
      }

      return false;
  }

  _computeShowOptions(resourceAdmin, company) {
      return !resourceAdmin || !company;
  }

  /**
   * Listens for click outside.
   * @private
   */
  _handleDocumentClick(event) {
      const path = dom(event).path;

      if (!this._isInPath(path, this.shadowRoot.getElementById('addItemAction')) && !this._isInPath(path, this.shadowRoot.getElementById('addItemActionIconButton'))
              && !this._isInPath(path, this.shadowRoot.getElementById('addItemActionIconButton')))
      {
          this._addItemActionsVisible = false;
      }

      if (!this._isInPath(path, this)) {
          this.dispatchEvent(new CustomEvent('close-search', { bubbles: true, composed: true }));
      }
  }

  _toggleActionList() {
      this._addItemActionsVisible = !this._addItemActionsVisible;
  }

  _onAddItemActionSelect(event) {
      this.dispatchEvent(new CustomEvent('add-item-action', {
          bubbles: true,
          composed: true,
          detail: {
              action: event.detail.item.value,
              applicationTemplate: event.detail.item.tpl
          }
      }));
      this._addItemActionsVisible = false;
      this.shadowRoot.getElementById('resourcesActionList').selected = -1;
  }

  _onAddItemAction() {
      this._toggleActionList();
  }

  _onImportAction() {
      this.dispatchEvent(new CustomEvent('import-resources', { bubbles: true, composed: true }));
  }

  _onShareAction() {
      this.dispatchEvent(new CustomEvent('share', { bubbles: true, composed: true }));
  }

  _onRemoveAction() {
      this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true }));
  }

  _onSelectAllAction() {
      this.dispatchEvent(new CustomEvent('select-all-resources', { bubbles: true, composed: true }));
  }

  _onFilterItemsAction(event) {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('filter-items', {
          bubbles: true,
          composed: true,
          detail: {
              id: event.detail.item.getAttribute('value'),
              name: event.detail.item.getAttribute('name')
          }
      }));
  }

  focusSearch() {
      this.shadowRoot.getElementById('appscoSearch').setup();
  }

  _onBulkActionsChanged() {
      const bulkActions = dom(this.root).querySelectorAll('.bulk-action');

      if (this.animationConfig) {
          this.animationConfig.entry.nodes = bulkActions;
          this.animationConfig.exit.nodes = bulkActions;
      }

      if (this.bulkActions) {
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
      this._bulkSelectAll = !this.resourceAdmin;
  }

  hideBulkSelectAll() {
      this._bulkSelectAll = false;
  }

  _onBulkSelectAllChanged () {
      const bulkSelectAll = dom(this.root).querySelectorAll('.bulk-select-all');
      if (bulkSelectAll.length > 0) {
          if (this._bulkSelectAll) {
              bulkSelectAll[0].style.display = 'block';
          }else {
              bulkSelectAll[0].style.display = 'none';
          }
      }
  }

  showBulkActions() {
      this.bulkActions = true;
  }

  hideBulkActions() {
      this.bulkActions = false;
  }

  _onNeonAnimationFinish() {
      if (!this.bulkActions) {
          const bulkActions = dom(this.root).querySelectorAll('.bulk-action'),
              length = bulkActions.length;

          for (let i = 0; i < length; i++) {
              bulkActions[i].style.display = 'none';
          }
      }
  }

  reset() {
      if (this.shadowRoot.getElementById('appscoSearch')) {
          this.shadowRoot.getElementById('appscoSearch').reset();
      }
      if (this.shadowRoot.getElementById('filterItemsList')) {
          this.shadowRoot.getElementById('filterItemsList').selected = 0;
      }

      if (this.company) {
          this.hideBulkActions();
      }
  }

  _onShowPageSettings(event) {
      this.shadowRoot.getElementById('resourcePageConfigDropdown').toggle(event.target);
  }
}
window.customElements.define(AppscoApplicationActions.is, AppscoApplicationActions);
