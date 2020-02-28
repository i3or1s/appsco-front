/*
`appsco-invitation-remove`
Shows dialog screen with confirmation for invitation removal.

    <appsco-invitation-remove invitation="{}">
    </appsco-invitation-remove>

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
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoInvitationRemove extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
            appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            .buttons paper-button {
            @apply --paper-dialog-button;
            }
            .buttons paper-button[dialog-confirm] {
            @apply --paper-dialog-confirm-button;
            }
            .buttons paper-button[dialog-dismiss] {
            @apply --paper-dialog-dismiss-button;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <div class="header">
                <h2>Invitation remove</h2>
            </div>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="remove-container">
                    <p>Please confirm invitation removing for [[ invitation.email ]].</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_onRemove">Remove</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-invitation-remove'; }

  static get properties() {
      return {
          invitation: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _removeApi: {
              type: String,
              computed: '_computeRemoveApi(invitation)'
          },

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  _computeRemoveApi(invitation) {
      return invitation && invitation.self ? invitation.self : null;
  }

  setInvitation(invitation) {
      this.set('invitation', invitation);
  }

  open () {
      this.$.dialog.open();
  }

  _hide() {
      this.$.dialog.close();
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  _onRemove() {
      const request = document.createElement('iron-request'),
          options = {
              url: this._removeApi,
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          };

      this._showLoader();

      request.send(options).then(function() {
          const status = request.status;

          if (200 === status) {
              this.dispatchEvent(new CustomEvent('invitation-removed', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      invitation: this.invitation
                  }
              }));
          }

          this.set('invitation', {});
          this._hideLoader();
          this._hide();
      }.bind(this), function() {
          const status = request.status;

          if (404 === status) {
              this.dispatchEvent(new CustomEvent('invitation-already-removed', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      invitation: this.invitation
                  }
              }));
          }
          else {
              this.dispatchEvent(new CustomEvent('invitation-remove-failed', { bubbles: true, composed: true }));
          }

          this.set('invitation', {});
          this._hideLoader();
          this._hide();
      }.bind(this));
  }
}
window.customElements.define(AppscoInvitationRemove.is, AppscoInvitationRemove);
