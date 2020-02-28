/**
`appsco-account-authorized-app-revoke`
Shows dialog screen with confirmation for application revoke.

    <appsco-account-authorized-app-revoke>
    </appsco-account-authorized-app-revoke>

### Styling

`<appsco-account-authorized-app-revoke>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--account-authorized-app-revoke` | Mixin for the root element | `{}`

@demo demo/appsco-account-authorized-app-revoke.html
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
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountAuthorizedAppRevoke extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --account-authorized-app-revoke;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
            @apply --appsco-paper-dialog;
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
        <paper-dialog id="revokeDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <div class="revoke-container">

                <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is removing application" multi-color=""></appsco-loader>

                <h2>Revoke application [[ application.title ]]</h2>
                <p>Are you sure you want to revoke access to [[ application.title ]]?</p>

            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_revokeApplication">Revoke</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-account-authorized-app-revoke'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  open() {
      this.$.revokeDialog.open();
  }

  setApplication(application) {
      this.application = application;
  }

  _revokeApplication() {
      const appRequest = document.createElement('iron-request');

      this._loader = true;

      appRequest.send({
          url: this.application.revoke,
          method: "DELETE",
          handleAs: 'json',
          headers: this._headers
      }).then(function() {
          this._loader = false;

          this.dispatchEvent(new CustomEvent('application-revoked', {
              bubbles: true,
              composed: true,
              detail: {
                  application: this.application
              }
          }));
          this.$.revokeDialog.close();
      }.bind(this));
  }
}
window.customElements.define(AppscoAccountAuthorizedAppRevoke.is, AppscoAccountAuthorizedAppRevoke);
