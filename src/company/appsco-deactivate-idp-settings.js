/*
`appsco-deactivate-idp-settings`
Shows dialog screen with confirmation to deactivate IdP settings.

    <appsco-deactivate-idp-settings domain="{}"
                                    authorization-token=""></appsco-deactivate-idp-settings>
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
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoDeactivateIdpSettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;

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

            <h2>Deactivate IdP settings for [[ domain.domain ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="remove-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <p>Please confirm deactivation of IdP settings for [[ domain.domain ]] domain.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onDeactivateAction">Deactivate</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-deactivate-idp-settings'; }

  static get properties() {
      return {
          domain: {
              type: Array,
              value: function () {
                  return {};
              }
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _deactivateApi: {
              type: String,
              computed: '_computeDeactivateApi(domain)'
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

  setDomain(domain) {
      this.domain = domain;
  }

  open() {
      this.$.dialog.open();
  }

  close() {
      this.$.dialog.close();
  }

  toggle() {
      this.$.dialog.toggle();
  }

  _computeDeactivateApi(domain) {
      return (domain.meta && domain.meta.idpConfig) ? domain.meta.idpConfig : null;
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  _showError(message) {
      this._errorMessage = message;
  }

  _hideError() {
      this._errorMessage = '';
  }

  _onDialogClosed() {
      this._hideError();
      this._hideLoader();
      this.set('domain', {});
  }

  _onDeactivateAction() {
      var request = document.createElement('iron-request'),
          options = {
              url: this._deactivateApi,
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          };

      this._showLoader();

      request.send(options).then(function() {
          if (200 === request.status) {
              this.domain.hasIdp = false;
              this.domain.meta.idpConfig = null;

              this.dispatchEvent(new CustomEvent('idp-settings-deactivated', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      idPConfig: request.response,
                      domain: this.domain
                  }
              }));

              this.close();
          }
      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();
      }.bind(this));
  }
}
window.customElements.define(AppscoDeactivateIdpSettings.is, AppscoDeactivateIdpSettings);
