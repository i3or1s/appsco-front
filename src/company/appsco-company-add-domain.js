import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyAddDomain extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
            .emphasized {
                font-weight: 500;
            }
            .support-link {
                color: var(--app-primary-color-dark);
            }
        </style>

        <paper-dialog id="addCompanyDomainDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add domain</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <template is="dom-if" if="[[ _supportLink ]]">
                        <a href="https://support.appsco.com/hc/en-gb" target="_blank" rel="noopener noreferrer" class="support-link">Read more in AppsCo Support Knowledgebase</a>
                    </template>

                    <p>
                        Enter domain below.
                        Example: <span class="emphasized">my-domain.com</span>
                    </p>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ addDomainApi ]]">

                            <div class="input-container">
                                <paper-input id="domainName" label="Your domain" name="company_domain[domain]" required="" auto-validate="" error-message="Please enter domain name."></paper-input>
                            </div>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="" id="companyDomainDialogCancelButton">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_submitForm" id="companyDomainDialogAddButton">Add</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-company-add-domain'; }

  static get properties() {
      return {
          addDomainApi: {
              type: String
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

          _supportLink: {
              type: Boolean,
              value: false
          },

          _target: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this._target = this.$.form;
  }

  open() {
      this.$.addCompanyDomainDialog.open();
  }

  close() {
      this.$.addCompanyDomainDialog.close();
  }

  toggle() {
      this.$.addCompanyDomainDialog.toggle();
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
      this._hideAppscoSupportLink();
  }

  _showAppscoSupportLink() {
      this._supportLink = true;
  }

  _hideAppscoSupportLink() {
      this._supportLink = false;
  }

  _onDialogOpened() {
      this.$.domainName.focus();
  }

  _onDialogClosed() {
      this._hideLoader();
      this._hideError();
      this._target.reset();
  }

  _onEnter() {
      this._submitForm();
  }

  _submitForm() {
      this._hideError();

      if (this._target.validate()) {
          this._showLoader();
          this._target.submit();
      }
  }

  _onFormError(event) {
      var code = event.detail.request.response.code;
      
      if (1497441483 == code) {
          this._showAppscoSupportLink();
      }
      
      this._showError(this.apiErrors.getError(code));
      this._hideLoader();
  }

  _onFormResponse(event) {
      this.close();
      this.dispatchEvent(new CustomEvent('domain-added', {
          bubbles: true,
          composed: true,
          detail: {
              domain: event.detail.response
          }
      }));
  }
}
window.customElements.define(AppscoCompanyAddDomain.is, AppscoCompanyAddDomain);
