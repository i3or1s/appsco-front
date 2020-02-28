import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import './appsco-company-group-item.js';
import './appsco-group-list-item.js';
import '../account/appsco-accounts.js';
import '../account/appsco-contacts.js';
import '../components/appsco-list-item-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyGroupNotificationDialog extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles">
            :host {
                display: block;
                position: relative;

                --paper-checkbox-unchecked-color: var(--secondary-text-color);
                --paper-checkbox-checked-color: var(--secondary-text-color);
                --paper-checkbox-size: 22px;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host paper-progress {
                width: 100%;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host appsco-form-error {
                box-sizing: border-box;
                margin-top: 0 !important;
            }
            .dialog-container {
                padding-bottom: 20px;
            }
            .filter-accounts {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-top: 0 !important;
            }
            appsco-search {
                margin-right: 20px;
                @apply --layout-flex;
            }
            :host .item-info {
                padding: 0;
            }
            :host .info-value {
                font-size: 14px;
            }
            :host .item-type {
                text-transform: capitalize;
            }
            :host table {
                width: 100%;
                border-collapse: collapse;
            }
            :host table thead tr th {
                text-align: left;
                font-size: 16px;
                font-weight: normal;
                padding: 10px 4px;
                border-bottom: 1px solid var(--divider-color);
            }
            :host table thead tr th:first-of-type {
                width: 40px;
            }
            :host table thead tr th:last-of-type {
                width: 60px;
            }
            :host table tbody tr td {
                padding: 10px 4px 0;
            }
            :host paper-checkbox {
                width: 22px;
                margin: 0 auto 0 4px;
            }
            :host paper-checkbox::shadow paper-ripple {
                width: 200% !important;
                height: 200% !important;
                top: -50% !important;
                left: -50% !important;
            }
            :host .message {
                @apply --info-message;
            }
            :host .selected-info {
                height: 20px;
                position: absolute;
                top: 0;
                left: 24px;
                bottom: 0;
                margin: auto;
                font-size: 12px;
                color: var(--secondary-text-color);
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host *[hidden] {
                display: none;
            }
            paper-input {
                width: 100%;
                line-height: 26px;
                box-sizing: border-box;

                --paper-input-container-label: {
                    font-size: 14px;
                    line-height: 20px;
                    bottom: 0;
                    top: initial;
                    left: 5px;
                };

                --paper-input-container-input: {
                    font-size: 14px;
                    line-height: 20px;
                    left: 5px;
                };

                --paper-input-container-underline-focus: {
                    border-bottom: 1px solid var(--paper-input-focused-color);
                };
            }
            div[prefix] iron-icon {
                width: 18px;
                height: 18px;
                margin: 0;
                @apply --paper-input-prefix-icon;
                @apply --appsco-search-input-prefix-icon;

                --iron-icon-fill-color: var(--paper-input-color);
            }
            paper-input[focused] div[prefix] {
                @apply --paper-input-focused-prefix;
            }
            paper-input[focused] div[prefix] iron-icon {
                fill: var(--paper-input-focused-color);
            }
        </style>

        <appsco-company-groups hidden="" id="appscoGroups" type="group" size="1000" authorization-token="[[ authorizationToken ]]" list-api="[[ companyGroupsApi ]]" no-auto-load="" on-list-loaded="_onGroupsLoadFinished" on-filter-done="_onGroupsLoadFinished" on-list-empty="_onGroupsLoadFinished"></appsco-company-groups>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Send notification</h2>

            <appsco-loader active="[[ _createLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

            <paper-input id="notificationMessage" label="Message" value="{{ _notificationMessage }}">
                <div prefix="" slot="prefix">
                    <iron-icon icon="icons:create"></iron-icon>
                </div>
            </paper-input>

            <div class="filter-groups">
                <appsco-search id="appscoSearch" label="Search for groups" float-label="" on-search="_onSearchGroups" on-search-clear="_onSearchGroupsClear"></appsco-search>
            </div>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <div class="group-list">
                        <paper-progress id="groupListProgress" indeterminate=""></paper-progress>
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    <paper-checkbox id="bulkSelect" on-tap="_onBulkSelect" checked\$="[[ _bulkSelect ]]"></paper-checkbox>
                                </th>
                                <th>Name</th>
                                <th>Type</th>
                            </tr>
                            </thead>

                            <tbody>
                            <template is="dom-repeat" items="[[ _groupList ]]">
                                <tr>
                                    <td>
                                        <div>
                                            <appsco-group-list-item on-select-item="_onGroupListItemSelectChanged" item="[[ item ]]"></appsco-group-list-item>
                                        </div>
                                    </td>

                                    <td>
                                        <div class="item-info">
                                            <span class="info-value">[[ item.name ]]</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="item-info">
                                            <span class="info-value">Group</span>
                                        </div>
                                    </td>

                                </tr>
                            </template>
                            </tbody>
                        </table>

                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">
                                [[ _message ]]
                            </p>
                        </template>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <div class="selected-info">
                    Selected [[ _numberOfSelectedGroups ]] out of [[ _groupsCount ]]
                </div>
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onCreateNotificationAction">Add</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-company-group-notification-dialog'; }

  static get properties() {
      return {
          companyGroupsApi: {
              type: String
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _groupList: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _groupListAll: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _message: {
              type: String
          },

          _selectedGroups: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _createLoader: {
              type: Boolean,
              value: false
          },

          _componentReady: {
              type: Boolean,
              value: false
          },

          _bulkSelect: {
              type: Boolean,
              value: false
          },

          _groupsCount: {
              type: Number,
              value: 0
          },

          _numberOfSelectedGroups: {
              type: Number,
              value: 0
          },

          _filterTerm: {
              type: String,
              value: ''
          },

          _notificationMessage: {
              type: String,
              value: ''
          },

          _response: {
              type: Number,
              value: 0
          },

          companyNotificationsApi: {
              type: String
          }
      };
  }

  toggle() {
      this.$.dialog.toggle();
  }

  _showLoader() {
      this._createLoader = true;
  }

  _hideLoader() {
      this._createLoader = false;
  }

  _showError(message) {
      this._errorMessage = message;
  }

  _hideError() {
      this._errorMessage = '';
  }

  _showMessage(message) {
      this._message = message;
  }

  _hideMessage() {
      this._message = '';
  }

  _showgroupListProgress() {
      this.$.groupListProgress.hidden = false;
  }

  _hidegroupListProgress() {
      setTimeout(function() {
          this.$.groupListProgress.hidden = true;
      }.bind(this), 500);
  }

  _onDialogOpened() {
      this.$.appscoSearch.setup();
      this.shadowRoot.getElementById('appscoGroups').reloadItems();
      this._componentReady = true;
  }

  _onDialogClosed() {
      this._reset();
  }

  _onGroupsLoadFinished() {
      const listItems = [];

      this._showgroupListProgress();

      this.set('_groupList', []);
      this.set('_groupListAll', []);

      const groupsComponent = this.shadowRoot.getElementById('appscoGroups'),
          groups = groupsComponent.getAllItems();

      groups.forEach(function(group, index) {
          group.selected = false;
          listItems.push(group);
      }.bind(this));

      this.set('_groupList', listItems);
      this.set('_groupListAll', listItems);
      this._groupsCount = this._groupList.length;
      this._hidegroupListProgress();
      this.dispatchEvent(new CustomEvent('groups-loaded', { bubbles: true, composed: true }));
  }

  _onBulkSelect() {
      this._hideError();

      if (this._componentReady) {
          this._bulkSelect = !this._bulkSelect;
          this._bulkSelect ? this._selectAllGroups() : this._deselectAllGroups();
      }
  }

  _selectAllGroups() {
      const list = JSON.parse(JSON.stringify(this._groupList)),
          length = list.length,
          listAll = JSON.parse(JSON.stringify(this._groupListAll)),
          lengthAll = listAll.length;

      for (let i = 0; i < length; i++) {
          list[i].selected = true;

          for (let j = 0; j < lengthAll; j++) {
              if (listAll[j].self === list[i].self) {
                  listAll[j].selected = true;
              }
          }
      }

      this.set('_groupList', []);
      this.set('_groupList', list);

      this.set('_groupListAll', []);
      this.set('_groupListAll', listAll);

      this._recalculateInfo();
  }

  _deselectAllGroups() {
      const list = JSON.parse(JSON.stringify(this._groupList)),
          length = list.length,
          listAll = JSON.parse(JSON.stringify(this._groupListAll)),
          lengthAll = listAll.length;

      for (let i = 0; i < length; i++) {
          list[i].selected = false;
          for (let j = 0; j < lengthAll; j++) {
              if (listAll[j].self === list[i].self) {
                  listAll[j].selected = false;
              }
          }
      }

      this.set('_groupList', []);
      this.set('_groupList', list);

      this.set('_groupListAll', []);
      this.set('_groupListAll', listAll);

      this._recalculateInfo();
  }

  _onGroupListItemSelectChanged(event) {
      const item = event.detail.item,
          listAll = JSON.parse(JSON.stringify(this._groupListAll)),
          lengthAll = listAll.length;

      if (!item.selected) {
          this._bulkSelect = false;
      }

      for (let j = 0; j < lengthAll; j++) {
          if (listAll[j].self === item.self) {
              listAll[j].selected = item.selected;
          }
      }

      this.set('_groupListAll', []);
      this.set('_groupListAll', listAll);

      this._recalculateInfo();
      this._setBulkSelectStatus();
      this._hideError();
  }

  _recalculateInfo() {
      const list = this._groupListAll,
          length = list.length;

      this._numberOfSelectedGroups = 0;

      for (let i = 0; i < length; i++) {
          if (list[i].selected) {
              this._numberOfSelectedGroups++;
          }
      }
  }

  _setBulkSelectStatus() {
      this._bulkSelect = (this._numberOfSelectedGroups === this._groupListAll.length);
  }

  _onSearchGroups(event) {
      const searchValue = event.detail.term,
          searchLength = searchValue.length;

      this._filterTerm = searchValue;

      if (searchLength < 3) {
          this._filterTerm = '';
      }

      this._filterGroupList();
  }

  _onSearchGroupsClear() {
      this._filterTerm = '';
      this._filterGroupList();
  }

  _filterGroupList() {
      const listAll = JSON.parse(JSON.stringify(this._groupListAll)),
          lengthAll = listAll.length,
          term = this._filterTerm.toLowerCase();

      this._hideMessage();
      this.set('_groupList', []);

      for (let i = 0; i < lengthAll; i++) {
          if (-1 !== listAll[i].name.toLowerCase().indexOf(term.toLowerCase())) {
              this.push('_groupList', listAll[i]);
          }
      }

      if (0 === this._groupList.length) {
          this._showMessage('There are no groups available according to selected filters.');
      }
  }

  _reset() {
      this.$.appscoSearch.reset() ;
      this.set('_groupList', []);
      this.set('_groupListAll', []);
      this.set('_selectedGroups', []);
      this._componentReady = false;
      this._filterTerm = '';
      this._numberOfSelectedGroups = 0;
      this._groupsCount = 0;
      this._bulkSelect = false;
      this._hideLoader();
      this._hideError();
      this._hideMessage();
  }

  _createNotification(selectedGroups) {
      let groupsLength = selectedGroups.length - 1,
          request = document.createElement('iron-request'),
          options = {
              url: this.companyNotificationsApi + '/admin-message',
              method: 'POST',
              handleAs: 'json',
              headers: this._headers
          },
          body = 'admin_message[message]=' + this._notificationMessage;

      for (let n = 0; n <= groupsLength; n++) {
          let isFirst = (n === 0) ? '&' : '';
          let hasNext = (n === groupsLength) ? '' : '&';
          body += isFirst + 'admin_message[group][]=' + encodeURIComponent(selectedGroups[n].self) + hasNext;
      }

      options.body = body;

      request.send(options).then(function() {
          this.set('_response', request.response['notified']);
          this._notificationsSendFinished();

      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();
      }.bind(this));
  }

  _notificationsSendFinished() {
      this.$.dialog.close();

      this.dispatchEvent(new CustomEvent('notification-sent', {
          bubbles: true,
          composed: true,
          detail: {
              counter: this._response
          }
      }));

      this.set('_response', 0);
      this._hideLoader();
  }

  _onCreateNotificationAction() {
      const list = JSON.parse(JSON.stringify(this._groupListAll)),
          message = this._notificationMessage,
          length = list.length;

      for (let i = 0; i < length; i++) {
          if (list[i].selected) {
              this._selectedGroups.push(list[i]);
          }
      }

      if (0 === this._selectedGroups.length) {
          this._showError('Please select atleast one group to send notification to.');
          return false;
      }

      if (!message) {
          this._showError('Please enter message to be sent.');
          return false;
      }

      this._createNotification(this._selectedGroups);
  }

  _onInnerIronOverlay(event) {
      event.stopPropagation();
  }
}
window.customElements.define(AppscoCompanyGroupNotificationDialog.is, AppscoCompanyGroupNotificationDialog);
