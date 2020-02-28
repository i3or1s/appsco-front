/**
`appsco-account-orgunit`
Provides functionality of adding accounts to organization units.

    <appsco-account-orgunit accounts="[]">
    </appsco-account-orgunit>

@demo demo/company/appsco-account-orgunit.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-form-error.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountOrgunit extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;

                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };

            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            paper-dropdown-menu {
            --paper-input-container: {
                 padding: 0;
             };
            }
            :host paper-listbox {
                @apply --paper-listbox;
                min-width: 225px;
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>

        <iron-ajax id="orgunitsAjax" auto="" url="[[ companyOrgunitsApi ]]" on-response="_handleResponse" on-error="_handleError" headers="{{ _headers }}"></iron-ajax>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add accounts to organization unit</h2>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is saving settings" multi-color=""></appsco-loader>

                    <p>Choose organization unit to add selected accounts to.</p>

                    <div class="form">
                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">[[ _message ]]</p>
                        </template>

                        <paper-dropdown-menu label="Organization unit" horizontal-align="left" on-iron-overlay-closed="_onOrgunitsDropdownClosed">
                            <paper-listbox id="orgunits" class="dropdown-content" attr-for-selected="value" slot="dropdown-content">
                                <template is="dom-repeat" items="[[ _orgunits ]]">
                                    <paper-item value="[[ item.self ]]" name="[[ item.name ]]">[[ item.name ]]</paper-item>
                                </template>
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </div>

                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAddAction">Add</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-account-orgunit'; }

  static get properties() {
      return {
          companyOrgunitsApi: {
              type: String
          },

          accounts: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _orgunits: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _message: {
              type: String
          },

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  toggle() {
      this.$.dialog.toggle();
  }

  setAccounts(accounts) {
      this.accounts = accounts;
  }

  _onDialogOpened() {
      this.$.orgunitsAjax.generateRequest();
  }

  _onDialogClosed() {
      this.$.orgunits.select(0);
      this._loader = false;
      this._error = '';
      this._message = '';
  }

  _onOrgunitsDropdownClosed(event) {
      event.stopPropagation();
  }

  _handleResponse(event) {
      const response = event.detail.response;

      this.set('_orgunits', []);

      if (response && response.orgunits.length > 0) {
          this._message = '';

          response.orgunits.forEach(function(item, index) {
              this.push('_orgunits', item);
          }.bind(this));
      }
      else {
          this._message = 'There are no organization units.';
      }
  }

  _handleError() {
      this._message = 'We couldn\'t load organization units at the moment. Please try again in a minute.';
  }

  _onAddAction() {
      const orgunit = this.$.orgunits.selectedItem;

      this._loader = true;

      if (!orgunit) {
          this._message = 'Please choose organization unit to add accounts to.';
          this._loader = false;
          return false;
      }

      let accounts = this.accounts,
          length = accounts.length - 1,
          appRequest = document.createElement('iron-request'),
          options = {
              url: orgunit.value + '/roles',
              method: 'POST',
              handleAs: 'json',
              headers: this._headers
          },
          body = '';

      this._message = '';

      for (let i = 0; i <= length; i++) {
          const next = (i === length) ? '' : '&';
          body += 'roles[]=' + encodeURIComponent(accounts[i].self) + next;
      }

      options.body = body;

      appRequest.send(options).then(function(request) {
          this.$.dialog.close();

          this.dispatchEvent(new CustomEvent('added-to-orgunit', {
              bubbles: true,
              composed: true,
              detail: {
                  accounts: request.response.company_roles,
                  orgunit: {
                      name: orgunit.name,
                      self: orgunit.value
                  }
              }
          }));

          this._loader = false;
      }.bind(this));
  }
}
window.customElements.define(AppscoAccountOrgunit.is, AppscoAccountOrgunit);
