import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoRunIntegrationForceSync extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-run-integration-force-sync;

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
            :host .error-box {
                max-height: 250px;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Run resync</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div>
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <div class="error-box">
                        <template is="dom-if" if="[[ _missingSource.accounts ]]">
                            <h4>Accounts missing source:</h4>
                            <template is="dom-repeat" items="[[ _accountsMissingSource ]]">
                                <span>[[ item ]]</span> <br>
                            </template>
                        </template>

                        <template is="dom-if" if="[[ _missingSource.contacts ]]">
                            <h4>Contacts missing source:</h4>
                            <template is="dom-repeat" items="[[ _contactsMissingSource ]]">
                                <span>[[ item ]]</span><br>
                            </template>
                        </template>

                        <template is="dom-if" if="[[ _missingSource.groups ]]">
                            <h4>Groups missing source:</h4>
                            <template is="dom-repeat" items="[[ _groupsMissingSource ]]">
                                <span>[[ item ]]</span><br>
                            </template>
                        </template>

                        <template is="dom-if" if="[[ _missingSource.resources ]]">
                            <h4>Resources missing source:</h4>
                            <template is="dom-repeat" items="[[ _resourcesMissingSource ]]">
                                <span>[[ item ]]</span><br>
                            </template>
                        </template>
                    </div>


                </div>
            </paper-dialog-scrollable>

            <div>
                <p>Please confirm that you want to run resync.</p>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onConfirmAction">Apply</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-run-integration-force-sync'; }

  static get properties() {
      return {
          integration: {
              type: Object,
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

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          },

          _errorDetails: {
              type: Object,
              value: null
          },

          _accountsMissingSource: {
              type: Array,
              computed: '_computeAccountsMissingSource(_errorDetails)'
          },

          _contactsMissingSource: {
              type: Array,
              computed: '_computeContactsMissingSource(_errorDetails)'
          },

          _groupsMissingSource: {
              type: Array,
              computed: '_computeGroupsMissingSource(_errorDetails)'
          },

          _resourcesMissingSource: {
              type: Array,
              computed: '_computeResourcesMissingSource(_errorDetails)'
          },

          _missingSource: {
              type: Object,
              computed: '_computeMissingSource(_accountsMissingSource, _contactsMissingSource, _groupsMissingSource, _resourcesMissingSource)'
          }
      };
  }

  setIntegration(integration) {
      this.set('integration', integration);
  }

  open() {
      this._hideError();
      this.$.dialog.open();
  }

  close() {
      this._hideError();
      this.$.dialog.close();
  }

  toggle() {
      this._hideError();
      this.$.dialog.toggle();
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
      this._errorDetails = '';
      this._errorMessage = '';
  }

  _onDialogClosed() {
      this._hideError();
      this._hideLoader();
  }

  _computeAccountsMissingSource(errorDetails) {
      if (!errorDetails || !errorDetails.accounts) {
          return [];
      }

      return errorDetails.accounts;
  }

  _computeContactsMissingSource(errorDetails) {
      if (!errorDetails || !errorDetails.contacts) {
          return [];
      }

      return errorDetails.contacts;
  }

  _computeGroupsMissingSource(errorDetails) {
      if (!errorDetails || !errorDetails.groups) {
          return [];
      }

      return errorDetails.groups;
  }

  _computeResourcesMissingSource(errorDetails) {
      if (!errorDetails || !errorDetails.resources) {
          return [];
      }

      return errorDetails.resources;
  }

  _onConfirmAction() {
      const request = document.createElement('iron-request'),
          options = {
              url: this.integration.meta.forceSync,
              method: 'POST',
              handleAs: 'json',
              headers: this._headers
          };

      this._hideError();
      this._errorDetails = null;
      this._showLoader();

      request.send(options).then(function() {
          if (200 === request.status) {
              this.dispatchEvent(new CustomEvent('integration-force-sync-done', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      integration: this.integration,
                      rule: request.response
                  }
              }));

              this.close();
          }
      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();

          if (request.response.code == '1555935569') {
              this.set('_errorDetails', request.response.details);
          }
      }.bind(this));
  }

  _computeMissingSource (
      accountsMissingSource,
      contactsMissingSource,
      groupsMissingSource,
      resourcesMissingSource
  ) {
      const result = {};
      result.accounts = (accountsMissingSource && accountsMissingSource.length > 0);
      result.contacts = (contactsMissingSource && contactsMissingSource.length > 0);
      result.groups = (groupsMissingSource && groupsMissingSource.length > 0);
      result.resources = (resourcesMissingSource && resourcesMissingSource.length > 0);

      return result;
  }
}
window.customElements.define(AppscoRunIntegrationForceSync.is, AppscoRunIntegrationForceSync);
