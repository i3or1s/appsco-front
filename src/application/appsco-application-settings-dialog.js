import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/components/appsco-loader.js';
import '../components/application/appsco-application-settings.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationSettingsDialog extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
                        <appsco-application-settings id="appscoApplicationSettings" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" application-settings="[[ _applicationSettings ]]" disable-submit="" on-application-settings-saved="_onApplicationsSettingsSaved" on-application-settings-no-changes="_onApplicationsSettingsSaved" on-form-error="_onFormError"></appsco-application-settings>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onSave">Save</paper-button>
            </div>

        </paper-dialog>

        <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-application-settings-dialog'; }

  static get properties() {
      return {
          account: {
              type: Object,
              value: function () {
                  return {};
              }
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

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  setApplication(application) {
      this.application = application;
  }

  /**
   * Toggles add applications dialog.
   */
  toggle() {
      this.$.dialog.toggle();
  }

  /**
   * Called after dialog has been closed.
   *
   * @private
   */
  _onDialogClosed() {
      this._loader = false;
  }

  _onEnter() {
      this._onSave();
  }

  _onSave() {
      this._showLoader();
      this.$.appscoApplicationSettings.save();
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
}
window.customElements.define(AppscoApplicationSettingsDialog.is, AppscoApplicationSettingsDialog);
