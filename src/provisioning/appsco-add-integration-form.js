import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import './appsco-integration-form.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAddIntegrationForm extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            }
            :host paper-dialog-scrollable {
                height: 440px;
                @apply --appsco-paper-dialog;
            }
            paper-dropdown-menu {
                width: 100%;
            }
            paper-toggle-button {
                cursor: pointer;
                margin-top: 20px;
            }
        </style>

        <div id="appscoAddIntegrationForm">

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action\$="[[ _formAction ]]">
                            <appsco-integration-form id="appscoIntegrationForm" form-type="create" name="appsco-integration-form" integration="[[ integration ]]">
                            </appsco-integration-form>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>
        </div>

        <iron-a11y-keys target="[[ _form ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-add-integration-form'; }

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

          _formAction: {
              type: String,
              computed: '_computeFormAction(integration)'
          },

          _integrationKindList: {
              type: Array,
              value: function () {
                  return [
                      {
                          value: 'ra',
                          name: 'From integration system to AppsCo'
                      },
                      {
                          value: 'pst',
                          name: 'From AppsCo to integration system'
                      }
                  ];
              }
          },

          _integrationScheduleSyncList: {
              type: Array,
              value: function () {
                  return [
                      {
                          value: 'daily',
                          name: 'Every day'
                      },
                      {
                          value: 'weekly',
                          name: 'Every Monday'
                      },
                      {
                          value: 'monthly',
                          name: 'Every 1st in the month'
                      }
                  ];
              }
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          },

          _form: {
              type: Object
          },

          animationConfig: {
              type: Object
          },

          sharedElements: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this._form = this.$.form;
      this.animationConfig = {
          'entry': [{
              name: 'hero-animation',
              id: 'hero',
              toPage: this
          }, {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  duration: 600
              }
          }],
          'exit': {
              name: 'fade-out-animation',
              node: this
          }
      };
      this.sharedElements = {
          'hero': this.$.appscoAddIntegrationForm
      }
  }

  setIntegration(integration) {
      this.set('integration', integration);
  }

  addIntegration() {
      var form = this._form;

      if (form.validate()) {
          this._showLoader();
          form.submit();
      }
  }

  reset() {
      this._form.reset();
      this.$.appscoIntegrationForm.setToggleChecked(false);
      this.set('integration', {});
      this._hideError();
      this._hideLoader();
  }

  _computeFormAction(integration) {
      return integration.self ? integration.self : null;
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

  _onSelectClosed(event) {
      event.stopPropagation();
  }

  _onEnter() {
      this.addIntegration();
  }

  _onFormPresubmit(event) {
      var form = event.target,
          integrationKind = this.$.appscoIntegrationForm.getIntegrationKind(),
          integrationScheduleSync = this.$.appscoIntegrationForm.getIntegrationScheduleSync(),
          integrationForceSync = this.$.appscoIntegrationForm.getIntegrationForceSync();

      form.request.body['activate_integration[kind]'] =
          integrationKind ? integrationKind : '';
      form.request.body['activate_integration[scheduleSyncInterval]'] =
          integrationScheduleSync ? integrationScheduleSync : '';
      form.request.body['activate_integration[forceSyncInterval]'] =
          integrationForceSync ? integrationForceSync : '';
  }

  _onFormError(event) {
      this._showError(this.apiErrors.getError(event.detail.request.response.code));
      this._hideLoader();
  }

  _onFormResponse(event) {
      this._hideLoader();

      if (200 === event.detail.status) {
          this.dispatchEvent(new CustomEvent('integration-requested', {
              bubbles: true,
              composed: true,
              detail: {
                  authorizationUrl: event.detail.response.authorization_url
              }
          }));
      }
  }
}
window.customElements.define(AppscoAddIntegrationForm.is, AppscoAddIntegrationForm);
