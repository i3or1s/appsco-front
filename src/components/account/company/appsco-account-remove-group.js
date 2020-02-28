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
class AppscoAccountRemoveGroup extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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

            <h2>Remove [[ account.account.name ]] from [[ group.name ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="remove-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                    <p>Please confirm removal of [[ account.account.name ]] from [[ group.name ]] group.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_remove">Remove</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-account-remove-group'; }

  static get properties() {
      return {
          account: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          group: {
              type: Object,
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

  setGroup(group) {
      this.group = group;
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
              url: this.group.meta.self + '/company-roles/' + this.account.alias,
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          };

      this._loader = true;

      appRequest.send(options).then(function(request) {
          this.$.dialog.close();

          this.dispatchEvent(new CustomEvent('account-removed-from-group', {
              bubbles: true,
              composed: true,
              detail: {
                  account: request.response,
                  group: this.group
              }
          }));
      }.bind(this), function() {
          if (appRequest.status !== 200) {
              this._errorMessage = this.apiErrors.getError(request.response.code);
          }

          this._loader = false;
      }.bind(this));
  }
}
window.customElements.define(AppscoAccountRemoveGroup.is, AppscoAccountRemoveGroup);
