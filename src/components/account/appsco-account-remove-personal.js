import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountRemovePersonal extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
            }
            :host paper-button {
                @apply --paper-dialog-button
            }
            :host paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
        </style>

        <paper-dialog id="removeDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <div class="remove-container">

                <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is removing your account" multi-color=""></appsco-loader>

                <h2>Delete account </h2>

                <p>If you delete your account all your data will be lost. Please confirm delete.</p>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confir="" autofocus="" on-tap="_onAccountRemove">Remove</paper-button>
            </div>

        </paper-dialog>
`;
  }

  static get is() { return 'appsco-account-remove-personal'; }

  static get properties() {
      return {
          removeAccountApi: {
              type: String
          },

          logoutApi: {
              type: String
          },

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  open() {
      this.$.removeDialog.open();
  }

  _onDialogClosed() {
      this._loader = false;
  }

  _onAccountRemove() {
      const appRequest = document.createElement('iron-request');

      this._loader = true;

      appRequest.send({
          url: this.removeAccountApi,
          method: 'DELETE',
          handleAs: 'json',
          headers: this._headers
      }).then(function() {
          this.$.removeDialog.close();
          window.location.href = this.logoutApi;
      }.bind(this));
  }
}
window.customElements.define(AppscoAccountRemovePersonal.is, AppscoAccountRemovePersonal);
