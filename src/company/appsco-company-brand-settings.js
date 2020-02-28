/*
`appsco-company-brand-settings`
Update company settings component.

    <appsco-company-brand-settings company={}
                             authorization-token=""
                             settings-api="">
    </appsco-company-brand-settings>

### Styling

`<appsco-company-brand-settings>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-company-brand-settings` | Mixin for the root element | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-swatch-picker/paper-swatch-picker.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-styles/typography.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import './appsco-company-image-settings.js';
import './appsco-company-dashboard-image-settings.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyBrandSettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-company-brand-settings;

                --paper-input-container-label: {
                    font-size: 14px;
                };

                --appsco-upload-image-settings: {
                    display: inline-block;
                };
            }
            .form-input-container {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-bottom: 20px;
            }
            .form-input-picker {
                min-width: 130px;
            }
            .form-input-text {
                @apply --layout-flex;
            }
            paper-swatch-picker.background {
                background-color: var(--body-background-color, #fafafa);
            }
            :host .logo-upload {
                margin-top: 20px;
            }
            .label {
                @apply --paper-font-subhead;
                display: block;
                color: var(--secondary-text-color);
                font-size: 14px;
            }
            .or-label {
                margin-left: 40px;
                margin-right: 40px;
                color: var(--primary-text-color);
            }
            appsco-company-image-settings {
                margin-top: 5px;
            }
            .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
            :host .description {
                font-size: 12px;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse" on-keyup="_onKeyUp">
            <form method="POST" action="[[ settingsApi ]]">

                <div class="form-input-container">
                    <div class="form-input form-input-picker">
                        <label for="brandColorPicker" class="label">Pick a brand color</label>
                        <paper-swatch-picker id="brandColorPicker" class\$="[[ _brandColorClass ]]" color="{{ _brandColor }}"></paper-swatch-picker>
                    </div>

                    <label for="brandColorInput" class="label or-label">or</label>

                    <div class="form-input form-input-text">
                        <label for="brandColorPicker" class="label">Enter hex code</label>
                        <paper-input id="brandColorInput" label="Brand color" name="company_branding[primaryColor]" value="{{ _brandColor }}" no-label-float="" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\$" auto-validate="" error-message="Please enter valid hex code."></paper-input>
                    </div>
                </div>

                <div class="form-input-container">
                    <div class="form-input form-input-picker">
                        <label for="brandTextColorPicker" class="label">Pick a text color</label>
                        <paper-swatch-picker id="brandTextColorPicker" class\$="[[ _brandTextColorClass ]]" color="{{ _brandTextColor }}"></paper-swatch-picker>
                    </div>

                    <label class="label or-label">or</label>

                    <div class="form-input form-input-text">
                        <label for="brandTextColorPicker" class="label">Enter hex code</label>
                        <paper-input id="brandTextColorPicker" label="Text color" name="company_branding[secondaryColor]" value="{{ _brandTextColor }}" no-label-float="" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\$" auto-validate="" error-message="Please enter valid hex code."></paper-input>
                    </div>
                </div>
            </form>
        </iron-form>

        <div class="logo-upload">
            <label for="appscoCompanyImageSettings" class="label">Company logo</label>
            <appsco-company-image-settings id="appscoCompanyImageSettings" company="[[ company ]]" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ imageSettingsApi ]]"></appsco-company-image-settings>
        </div>

        <div class="logo-upload">
            <label for="appscoCompanyDashboardImageSettings" class="label">Dashboard logo</label>
            <div class="description">
                Dashboard logo will show up on the dashboard background. Please keep in mind that the image should
                be a transparent .png logo file. For the best possible result upload a larger image.
            </div>
            <br>
            <appsco-company-dashboard-image-settings id="appscoCompanyDashboardImageSettings" company="[[ company ]]" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ dashboardImageSettingsApi ]]"></appsco-company-dashboard-image-settings>
        </div>

        <paper-button id="companyBrandSettingsSaveBtn" class="submit-button" on-tap="_submitForm">Save</paper-button>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-company-brand-settings'; }

  static get properties() {
      return {
          company: {
              type: Object,
              value: function () {
                  return {};
              },
              observer: '_onCompanyChanged'
          },

          settingsApi: {
              type: String
          },

          imageSettingsApi: {
              type: String
          },

          dashboardImageSettingsApi: {
              type: String
          },

          _brandColor: {
              type: String,
              value: ''
          },

          _brandColorClass: {
              type: String,
              computed: '_computeColorClass(_brandColor)'
          },

          _brandTextColor: {
              type: String,
              value: ''
          },

          _brandTextColorClass: {
              type: String,
              computed: '_computeColorClass(_brandTextColor)'
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
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

  _computeColorClass(color) {
      return (color === '#fff' || color === '#ffffff') ? 'background' : '';
  }

  _onCompanyChanged(company) {
      this._brandColor = company.primary_color ? company.primary_color : '';
      this._brandTextColor = company.secondary_color ? company.secondary_color : '';
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  _onEnter() {
      this._submitForm();
  }

  _submitForm() {
      this.$.form.submit();
  }

  _onFormPresubmit() {
      this._showLoader();
      this.$.form.request.method = 'PATCH';
  }

  _onFormError(event) {
      this._errorMessage = event.detail.error.message;
      this._hideLoader();
  }

  _onFormResponse(event) {
      this.set('company', event.detail.response);

      this.dispatchEvent(new CustomEvent('company-brand-settings-changed', {
          bubbles: true,
          composed: true,
          detail: {
              company: this.company
          }
      }));

      this._hideLoader();
  }

  _onKeyUp() {
      this._errorMessage = '';
  }

  setup() {
      this.$.companyName.focus();
  }

  reset() {
      const company = JSON.parse(JSON.stringify(this.company));

      this.company = {};
      this.company = company;

      this._errorMessage = '';
      this.$.contactEmail.invalid = false;
      this.$.billingEmail.invalid = false;
  }
}
window.customElements.define(AppscoCompanyBrandSettings.is, AppscoCompanyBrandSettings);
