import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-form-error.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoFoldersRemove extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
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
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <div class="header">
                <h2>Remove dashboard folder</h2>
            </div>

            <paper-dialog-scrollable>
                <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>
                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                <div class="remove-container">
                    <p>Confirm removing [[ folder.name ]] from dashboard?</p>
                </div>
            </paper-dialog-scrollable>
            <iron-a11y-keys keys="enter" on-keys-pressed="_onDeleteAction"></iron-a11y-keys>
            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onDeleteAction">Confirm</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-folders-remove'; }

  static get properties() {
      return {
          folderItem: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _company: {
              type: String,
              value: ''
          },

          _errorMessage: {
              type: String,
              value: ''
          }
      };
  }

  toggle() {
      this._hideError();
      this.$.dialog.toggle();
  }

  setCompany(company) {
      this._company = company;
  }

  setFolderItem(folderItem) {
      this._hideError();
      this.folderItem = folderItem;
  }

  _showError(message) {
      this._errorMessage = message;
  }

  _hideError() {
      this._errorMessage = '';
  }

  _onDeleteAction() {
      const request = document.createElement('iron-request'),
          options = {
              url: this.folderItem.self,
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          };

      this._loader = true;

      request.send(options).then(function() {
          if (200 === request.status) {
              this.$.dialog.close();

              this.dispatchEvent(new CustomEvent('folder-removed', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      folder: this.folderItem
                  }
              }));
              this.set('folderItem', {});
          }
          this._loader = false;

      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._loader = false;
      }.bind(this));
  }
}
window.customElements.define(AppscoFoldersRemove.is, AppscoFoldersRemove);
