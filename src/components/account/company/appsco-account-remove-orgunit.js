/**
`appsco-account-remove-orgunit`
Shows dialog screen with confirmation for account removal from organization unit.

    <appsco-account-remove-orgunit account="[]" orgunit="{}">
    </appsco-account-remove-orgunit>

### Styling

`<appsco-account-remove-orgunit>` provides the following custom properties and mixins for styling:

@demo demo/company/appsco-account-remove-orgunit.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-form-error.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountRemoveOrgunit extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-account-remove;

                --form-error-box: {
                     margin-top: 0;
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
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host appsco-loader {
                @apply --paper-dialog-appsco-loader;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Remove [[ account.account.name ]] from [[ orgunit.name ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="remove-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                    <p>Please confirm removal of [[ account.account.name ]] from [[ orgunit.name ]] organization unit.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_remove">Remove</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-account-remove-orgunit'; }

  static get properties() {
      return {
          account: {
              type: Array,
              value: function () {
                  return {};
              }
          },

          orgunit: {
              type: Array,
              value: function () {
                  return {};
              }
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          }
      };
  }

  toggle() {
      this.$.dialog.open();
  }

  setOrgUnit(orgunit) {
      this.orgunit = orgunit;
  }

  setAccount(account) {
      this.account = account;
  }

  _onDialogClosed() {
      this._errorMessage = '';
      this._loader = false;
  }

  _remove() {
      const appRequest = document.createElement('iron-request'),
          options = {
              url: this.orgunit.meta.remove,
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          };

      this._loader = true;

      appRequest.send(options).then(function(request) {
          this.$.dialog.close();

          this.dispatchEvent(new CustomEvent('account-removed-from-orgunit', {
              bubbles: true,
              composed: true,
              detail: {
                  account: request.response,
                  orgunit: this.orgunit
              }
          }));
      }.bind(this), function() {
          if (appRequest.status === 404) {
              this._errorMessage = 'This account doesn\'t belong to your company.';
          }

          this._loader = false;
      }.bind(this));
  }
}
window.customElements.define(AppscoAccountRemoveOrgunit.is, AppscoAccountRemoveOrgunit);
