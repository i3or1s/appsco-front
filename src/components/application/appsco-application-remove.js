/**
`appsco-application-remove`
Shows dialog screen with resource subscriptions and confirmation for its removal.

    <appsco-application-remove>
    </appsco-application-remove>

### Styling

`<appsco-application-remove>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-application-remove` | Mixin for the root element | `{}`

@demo demo/appsco-application-remove.html
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
import './appsco-application-subscribers.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationRemove extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            @apply --appsco-application-remove;
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
        <paper-dialog id="removeDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <h2>Remove resource [[ application.title ]]</h2>

            <paper-dialog-scrollable>
                <div class="remove-container">

                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is removing application" multi-color=""></appsco-loader>

                    <p>By removing [[ application.title ]] you will also remove all resource subscribers.</p>

                    <appsco-application-subscribers size="10" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" preview=""></appsco-application-subscribers>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_removeApplication">Remove</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-application-remove'; }

  static get properties() {
      return {
          /**
           * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
           */
          application: {
              type: Object,
              value: {},
              notify: true
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

  setApplication(application) {
      this.application = application;
  }

  _removeApplication() {
      const appRequest = document.createElement('iron-request');

      this._loader = true;

      appRequest.send({
          url: this.application.meta["application-remove"],
          method: "DELETE",
          handleAs: 'json',
          headers: this._headers
      }).then(function() {
          this._loader = false;

          this.dispatchEvent(new CustomEvent('application-removed', {
              bubbles: true,
              composed: true,
              detail: {
                  application: this.application
              }
          }));
          this.$.removeDialog.close();
      }.bind(this));
  }
}
window.customElements.define(AppscoApplicationRemove.is, AppscoApplicationRemove);
