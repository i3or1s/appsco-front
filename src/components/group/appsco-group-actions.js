import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-button/paper-button.js';
import '../components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoGroupActions extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
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
                @apply --appsco-group-actions;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            appsco-search {
                max-width: 200px;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --group-action;
            }
            :host .bulk-action {
                display: none;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            :host .add-group-button {
                @apply --add-item-action;
            }
            :host paper-tooltip {
                top: 100% !important;
                font-weight: 500;
                min-width: 100px;
                text-align: center;
                @apply --group-actions-tooltip;
            }
        </style>

        <div class="action action-search flex-none">

            <appsco-search id="appscoSearch" label="Search groups"></appsco-search>
        </div>

        <div class="action flex-none">
            <paper-icon-button id="sendNotificationButton" icon="social:notifications" alt="Send notification" on-tap="_onSendNotificationAction"></paper-icon-button>
            <paper-tooltip for="removeGroupsAction" position="bottom">Remove group</paper-tooltip>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="removeGroupsAction" icon="icons:delete" alt="Remove groups" on-tap="_onRemoveGroupsAction"></paper-icon-button>
            <paper-tooltip for="removeGroupsAction" position="bottom">Remove group</paper-tooltip>
        </div>

        <div class="action bulk-select-all flex-none">
            <paper-icon-button id="selectAllAction" icon="icons:done-all" alt="Select all" on-tap="_onSelectAllAction"></paper-icon-button>
            <paper-tooltip for="selectAllAction" position="bottom">Select all</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-button id="addGroupAction" class="add-group-button" toggles="" on-tap="_onAddGroupAction">Create group</paper-button>
        </div>
`;
  }

  static get is() { return 'appsco-group-actions'; }

  static get properties() {
      return {
          /**
           * Indicates if bulk actions are visible or not.
           * Used to show / hide bulk actions.
           */
          _bulkActions: {
              type: Boolean,
              value: false,
              observer: '_onBulkActionsChanged'
          },

          _bulkActionsHidden: {
              type: Boolean,
              value: true
          },

          _bulkSelectAll: {
              type: Boolean,
              value: true,
              observer: '_onBulkSelectAllChanged'
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
  }

  _selected(e) {
      this.dispatchEvent(new CustomEvent('group-selected', {
          bubbles: true,
          composed: true,
          detail: {
              id: e.detail.item.getAttribute('value'),
              name: e.detail.item.getAttribute('name')
          }
      }));
  }

  _onAddGroupAction() {
      this.dispatchEvent(new CustomEvent('add-company-group', { bubbles: true, composed: true }));
  }

  _onSearchIcon() {
      this.dispatchEvent(new CustomEvent('search-icon', { bubbles: true, composed: true }));
  }

  _onSelectAllAction() {
      this.dispatchEvent(new CustomEvent('select-all-groups', { bubbles: true, composed: true }));
  }

  _onRemoveGroupsAction() {
      this.dispatchEvent(new CustomEvent('remove-groups', { bubbles: true, composed: true }));
  }

  _onSendNotificationAction() {
      this.dispatchEvent(new CustomEvent('notify-groups', { bubbles: true, composed: true }));
  }

  showBulkActions() {
      this._bulkActions = true;
  }

  hideBulkActions() {
      this._bulkActions = false;
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
      } else {
          bulkSelectAll[0].style.display = 'none';
      }
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

  _onNeonAnimationFinish() {
      if (!this._bulkActions) {
          const bulkActions = dom(this.root).querySelectorAll('.bulk-action'),
              length = bulkActions.length;

          for (let i = 0; i < length; i++) {
              bulkActions[i].style.display = 'none';
          }
      }
  }

  focusSearch() {
      this.$.appscoSearch.setup();
  }

  reset() {
      this.$.appscoSearch.reset();
      this.hideBulkActions();
  }
}
window.customElements.define(AppscoGroupActions.is, AppscoGroupActions);
