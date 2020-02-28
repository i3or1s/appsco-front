import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../components/appsco-loader.js';
import './appsco-company-resource-settings.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyResourceSettingsDialog extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            appsco-application-settings {
                --form-action: {
                    display: none;
                };
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Manage</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <div>
                        <appsco-company-resource-settings id="appscoCompanyResourceSettings" resource="[[ companyApplication ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" domain="[[ domain ]]" is-dialog="0"></appsco-company-resource-settings>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onSave">Save</paper-button>
            </div>

        </paper-dialog>
`;
  }

  static get is() { return 'appsco-company-resource-settings-dialog'; }

  static get properties() {
      return {
          account: {
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

          domain: {
              type: String
          },

          _applicationSettings: {
              type: Boolean,
              value: false
          },

          application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          companyApplication: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  setApplication(application) {
      this._loadCompanyApplication(application);
      this.application = application;
  }

  toggle() {
      this.$.dialog.toggle();
  }

  _onDialogClosed() {
      this._loader = false;
  }

  _onSave() {
      const _self = this;
      this.$.appscoCompanyResourceSettings.save(function() {
          _self.toggle();
          _self.dispatchEvent(new CustomEvent('company-resource-edited', {
              bubbles: true,
              composed: true,
              detail: {
                  resource: _self.companyApplication
              }
          }));
      });
  }

  _onApplicationsSettingsSaved() {
      this._hideLoader();
      this.toggle();
  }

  _onFormError() {
      this._hideLoader();
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  _loadCompanyApplication(application) {
      const applicationSelf = application && application.application
          ? application.application.meta.company_self
          : application.self;

      const request = document.createElement('iron-request'),
          options = {
              url: applicationSelf,
              method: 'GET',
              handleAs: 'json',
              headers: this._headers
          };

      this._showLoader();

      request.send(options).then(function() {
          if (200 === request.status) {
              var resource = request.response;
              this.set('companyApplication', resource);
              this._hideLoader();
          }

      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.error.code));
      }.bind(this));
  }
}
window.customElements.define(AppscoCompanyResourceSettingsDialog.is, AppscoCompanyResourceSettingsDialog);
