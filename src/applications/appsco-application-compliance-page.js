import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationCompliancePage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --item-background-color: var(--body-background-color);
            }
            paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    color: var(--primary-text-color);
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
            :host .info {
                margin-bottom: 0;
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
        </style>

        <paper-card heading="Compliance" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onBack"></paper-icon-button>

            <div class="card-content">

                <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                    <form action="[[ _complianceUpdateApi ]]" method="POST">

                        <p class="info">
                            Enter description about this resource and its purpose.
                        </p>

                        <div class="input-container">
                            <paper-input id="description" name="compliance[description]" value="[[ _descriptionValue ]]" label="Description" data-stripe="name"></paper-input>
                        </div>

                        <p class="info">
                            Enter coma-separated user information stored by this resource.
                        </p>

                        <div class="input-container">
                            <paper-input id="fields" name="compliance[fields]" value="[[ _fieldsValue ]]" label="Fields" data-stripe="name"></paper-input>
                        </div>
                    </form>
                </iron-form>

                <paper-button id="submit" class="submit-button" on-tap="_onSaveAction">Save</paper-button>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-application-compliance-page'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              },
              observer: '_computeValues',
              notify: true
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _complianceUpdateApi: {
              type: String,
              computed: '_computeComplianceUpdateApi(application)'
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          },

          _complianceFieldsValue: {
              type: String,
              compute: '_computeComplianceFieldsValue(application)'
          },

          _descriptionValue: {
              type: String,
              value: ''
          },

          _fieldsValue: {
              type: String,
              value: ''
          },

          animationConfig: {
              type: Object
          },

          sharedElements: {
              type: Object
          }
      };
  }

  ready(){
      super.ready();

      this.animationConfig = {
          'entry': [{
              name: 'hero-animation',
              id: 'hero',
              toPage: this,
              timing: {
                  duration: 300
              }
          }, {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  duration: 500
              }
          }],
          'exit': {
              name: 'slide-right-animation',
              node: this,
              timing: {
                  duration: 200
              }
          }
      };

      this.sharedElements = {
          'hero': this.$.card
      };
  }

  _computeComplianceUpdateApi(application) {
      return application ? application.self + '/compliance' : null;
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

  _onBack() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  _onSaveAction() {
      this.$.form.submit();
  }

  _onFormPresubmit() {
      this._showLoader();
      this.$.form.request.method = 'PATCH';
  }

  _onFormError(event) {
      this._showError(this.apiErrors.getError(event.detail.request.response.code));
      this._hideLoader();
  }

  _onFormResponse() {
      this._hideLoader();
      this.dispatchEvent(new CustomEvent('compliance-info-updated', { bubbles: true, composed: true }));
  }

  _computeValues(newValue) {
      this._descriptionValue = (newValue && newValue.compliance && newValue.compliance.description) ? newValue.compliance.description : '';
      this._fieldsValue = (newValue && newValue.compliance && newValue.compliance.fields) ? newValue.compliance.fields: '';
  }
}
window.customElements.define(AppscoApplicationCompliancePage.is, AppscoApplicationCompliancePage);
