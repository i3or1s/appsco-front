/*
`appsco-company-application-add-settings`
Is used to present application settings.

Example:
    <body>
        <appsco-company-application-add-settings>
        </appsco-company-application-add-settings>


### Styling

`<appsco-company-application-add-settings>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-company-application-add-settings` | Mixin for the root element | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../../components/appsco-form-error.js';
import '../appsco-application-info.js';
import '../appsco-application-form-item.js';
import '../appsco-application-form-unpw.js';
import '../appsco-application-form-cc.js';
import '../appsco-application-form-login.js';
import '../appsco-application-form-passport.js';
import '../appsco-application-form-securenote.js';
import '../appsco-application-form-softwarelicence.js';
import '../appsco-application-form-saml.js';
import '../appsco-application-form-saml-dropbox.js';
import '../appsco-application-form-saml-office-365.js';
import '../appsco-application-form-open-id.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyApplicationAddSettings extends mixinBehaviors([
    Appsco.HeadersMixin,
    NeonSharedElementAnimatableBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host appsco-application-info {
                margin-bottom: 10px;

            --paper-font-caption: {
                 font-size: 14px;
             };
            }
            :host .claims-container {
                margin-top: 20px;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
            :host .info {
                @apply --info-message;
                margin-top: 20px;
            }
            :host p {
                margin-top: 4px;
                margin-bottom: 4px;
            }
        </style>
        <div id="applicationHeader">
            <template is="dom-if" if="[[ !application.custom_application ]]">
                <appsco-application-info application="[[ application ]]"></appsco-application-info>
            </template>
        </div>

        <div id="appscoApplicationSettings">

            <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

            <iron-form hidden="" id="applicationForm" headers="[[ _headers ]]" on-iron-form-response="_onFormResponse">
                <form method="POST" action\$="[[ addApplicationApi ]]">
                    <paper-input hidden="" type="text" name="application_templates[]" value="[[ application.self ]]"></paper-input>
                </form>
            </iron-form>

            <iron-form id="applicationConfigurationForm">
                <form>
                    <paper-input id="title" label="title" value="[[ application.title ]]" name="configure_application[title]" required="" auto-validate="" error-message="Please enter application title."></paper-input>
                    <paper-input id="url" label="url" value="[[ application.url ]]" pattern="[[ _urlValidationPattern ]]" error-message="Url is invalid." required="" auto-validate="" name="configure_application[url]" hidden\$="[[ !_shouldShowUrl ]]"></paper-input>
                </form>
            </iron-form>
        </div>
        <div class="claims-container">
            <template is="dom-if" if="[[ _claimsAvailable ]]">
                <paper-toggle-button checked\$="[[ _claimTypeIndividual ]]" on-change="_onChangeClaimType" on="" id="claimTypeBtn">Set individually</paper-toggle-button>
            </template>

            <template is="dom-if" if="[[ _claimTypeIndividual ]]">
                <div class="info">
                    <p>Every employee sets its own configuration.</p>
                    <p>Disable it in order to manage resource configuration for all employees.</p>
                </div>
            </template>

            <iron-form id="applicationClaimsForm" class="claims-form">
                <form></form>
            </iron-form>

            <template is="dom-if" if="[[ !_claimTypeIndividual ]]">
                <template is="dom-if" if="[[ _unPwAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-unpw data-claims="" claims-name-prefix="application_claims[claims]"></appsco-application-form-unpw>
                </template>

                <template is="dom-if" if="[[ _itemAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-item data-claims="" claims-name-prefix="application_claims[claims]"></appsco-application-form-item>
                </template>

                <template is="dom-if" if="[[ _creditCardAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-cc data-claims="" claims-name-prefix="application_claims[claims]"></appsco-application-form-cc>
                </template>

                <template is="dom-if" if="[[ _loginAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-login data-claims="" claims-name-prefix="application_claims[claims]"></appsco-application-form-login>
                </template>

                <template is="dom-if" if="[[ _passportAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-passport data-claims="" claims-name-prefix="application_claims[claims]"></appsco-application-form-passport>
                </template>

                <template is="dom-if" if="[[ _secureNoteAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-securenote data-claims="" claims-name-prefix="application_claims[claims]"></appsco-application-form-securenote>
                </template>

                <template is="dom-if" if="[[ _softwareLicenceAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-softwarelicence data-claims="" claims-name-prefix="application_claims[claims]"></appsco-application-form-softwarelicence>
                </template>

                <template is="dom-if" if="[[ _samlAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-saml data-claims="" claims-name-prefix="application_claims[claims]" domain="[[ domain ]]"></appsco-application-form-saml>
                </template>

                <template is="dom-if" if="[[ _openIDAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-open-id data-claims="" claims-name-prefix="application_claims[claims]" domain="[[ domain ]]"></appsco-application-form-open-id>
                </template>

                <template is="dom-if" if="[[ _samlDropBoxAuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-saml-dropbox data-claims="" claims-name-prefix="application_claims[claims]" domain="[[ domain ]]"></appsco-application-form-saml-dropbox>
                </template>

                <template is="dom-if" if="[[ _samlOffice365AuthType ]]" restamp="" on-dom-change="_onAuthTypeChanged">
                    <appsco-application-form-saml-office-365 data-claims="" claims-name-prefix="application_claims[claims]" domain="[[ domain ]]"></appsco-application-form-saml-office-365>
                </template>
            </template>

            <template is="dom-if" if="[[ _isSSOApplication ]]">
                <p class="info">
                    Edit application after it's added to the company resources
                    in order to access information for the service provider and complete setup.
                </p>
            </template>
        </div>
`;
  }

  static get is() { return 'appsco-company-application-add-settings'; }

  static get properties() {
      return {
          _action: {
              type: String,
              value: function () {
                  return '';
              },
              observer: '_onActionChanged'
          },

          /**
           * Application to add.
           */
          application: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          _claimTypeIndividual: {
              type: Boolean,
              value: false,
              observer: '_onClaimTypeChanged'
          },

          _claimsAvailable: {
              type: Boolean
          },

          _claimsFormActive: {
              type: Boolean,
              value: true
          },

          addApplicationApi: {
              type: String
          },

          _shouldShowUrl: {
              type: Boolean,
              computed: '_computeShouldShowUrl(application)'
          },

          _urlValidationPattern: {
              type: String,
              computed: '_computeUrlValidationPattern(application)'
          },

          _saveClaimsUri: {
              type: String
          },

          _errorMessage: {
              type: String
          },

          _supportedAuthTypes: {
              type: Array,
              value: function () {
                  return [
                      'icon_item', 'icon_unpw', 'icon_saml', 'icon_jwt', 'icon_cc', 'icon_login',
                      'icon_passport', 'icon_securenote', 'icon_softwarelicence', 'icon_none'
                  ]
              }
          },

          _itemAuthType: {
              type: Boolean,
              computed: '_computeAuthType(_action, "catalogue-application")'
          },

          _creditCardAuthType: {
              type: Boolean,
              computed: '_computeAuthType(_action, "credit-card")'
          },

          _loginAuthType: {
              type: Boolean,
              computed: '_computeAuthType(_action, "login")'
          },

          _passportAuthType: {
              type: Boolean,
              computed: '_computeAuthType(_action, "passport")'
          },

          _secureNoteAuthType: {
              type: Boolean,
              computed: '_computeAuthType(_action, "secure-note")'
          },

          _softwareLicenceAuthType: {
              type: Boolean,
              computed: '_computeAuthType(_action, "software-licence")'
          },

          _samlAuthType: {
              type: Boolean,
              computed: '_computeSAMLAuthType(application, _action, "saml")'
          },

          _openIDAuthType: {
              type: Boolean,
              computed: "_computeOpenIDAuthType(application, _action, 'open_id')"
          },

          _samlDropBoxAuthType: {
              type: Boolean,
              computed: "_computeSAMLAuthType(application, _action, 'saml_dropbox')"
          },

          _samlOffice365AuthType: {
              type: Boolean,
              computed: "_computeSAMLAuthType(application, _action, 'saml_office_365')"
          },

          _isSSOApplication: {
              type: Boolean,
              computed: '_computeIsSSOApplication(_samlAuthType, _samlDropBoxAuthType, _samlOffice365AuthType)'
          },

          _applicationForm: {
              type: Object
          },

          _applicationConfigurationForm: {
              type: Object
          },

          _applicationClaimsForm: {
              type: Object
          },

          _applicationClaimsActiveForm: {
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
          'hero': this.$.applicationHeader
      };

      this._applicationForm = this.$.applicationForm;
      this._applicationConfigurationForm = this.$.applicationConfigurationForm;
      this._applicationClaimsForm = this.$.applicationClaimsForm;

      afterNextRender(this, function() {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('application-changed', this._onApplicationChanged);
  }

  _onAuthTypeChanged() {
      this.set('_applicationClaimsActiveForm', dom(this.root).querySelector('[data-claims]'));
  }

  _computeAuthType(action, authType) {
      return action === authType;
  }

  _computeSAMLAuthType(application, _action, authType) {
      if(_action !== 'sso-application') {
          return false;
      }

      for(const type in application.auth_types) {
          if (type === authType) {
              return true;
          }
      }

      return false;
  }

  _computeOpenIDAuthType(application, _action, authType) {
      if(_action !== 'sso-application') {
          return false;
      }

      for(const type in application.auth_types) {
          if (type === authType) {
              return true;
          }
      }

      return false;
  }

  _computeIsSSOApplication(samlAuthType, samlDropBoxAuthType, samlOffice365AuthType) {
      return (samlAuthType || samlDropBoxAuthType || samlOffice365AuthType);
  }

  _claimsAvailableCompute(action) {
      this._claimsAvailable = (action !== 'sso-application' && action !== 'link');
  }

  setAction(action) {
      this._action = action;
  }

  _onActionChanged() {
      this._claimsAvailableCompute(this._action)
  }

  _onClaimTypeChanged(individual) {
      individual ? this._hideClaimsForm() : this._showClaimsForm();
  }

  _showClaimsForm() {
      if (this._applicationClaimsForm) {
          this._claimsFormActive = true;
          this._applicationClaimsForm.updateStyles({ 'display': 'block'});
      }
  }

  _hideClaimsForm() {
      this._claimsFormActive = false;
      this._resetClaimsForm();
  }

  _resetClaimsForm() {
      if (this._applicationClaimsForm) {
          this._applicationClaimsForm.reset();
      }
  }

  _onChangeClaimType() {
      this._claimTypeIndividual = !this._claimTypeIndividual;
  }

  _computeShouldShowUrl(application) {
      if (!(application && application.self)) {
          return false;
      }

      const auth = this._supportedAuthTypeByPriority(application.auth_types);
      return application.url_editable &&
          ['unpw', 'item', 'login', 'none', 'open_id'].indexOf(auth) !== -1;
  }

  _computeUrlValidationPattern(application) {
      const defaultPattern = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-zA-Z0-9]+([\\-\\.]{1}[a-zA-Z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?|^((http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$',
          allowFtpPattern = '^(http:\\/\\/|https:\\/\\/|ftp:\\/\\/|ftps:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?|^((http:\\/\\/|https:\\/\\/|ftp:\\/\\/|ftps:\\/\\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$';

      const auth = this._supportedAuthTypeByPriority(application.auth_types);
      return (['login', 'none'].indexOf(auth) !== -1) ? allowFtpPattern : defaultPattern;
  }

  _supportedAuthTypeByPriority(authTypes) {
      let authType = null,
          priority = 100;
      for (let prop in authTypes) {
          const currentPriority = this._supportedAuthTypes.indexOf(authTypes[prop]);
          if(priority > currentPriority) {
              authType = authTypes[prop];
              priority = currentPriority;
          }
      }

      if(null === authType) {
          return [];
      }

      return authType.substring('icon_'.length);
  }

  _onApplicationChanged() {
      setTimeout(function() {
          this.$.title.focus();
          this.$.url.invalid = false;
      }.bind(this), 100);
  }

  /**
   * Saves application configuration.
   *
   * @private
   */
  _updateApplicationSettings(application) {
      const title = this.$.title.value,
          url = this.$.url.value;

      if (application.title !== title || application.url !== url) {
          this._submitApplicationConfigure(application).then(function(application) {
              this.application = application;
              this._onApplicationAdded();

              this._saveClaims(application.meta.update_claims).then(function (applicationUpdated) {
                  this.application = applicationUpdated;
                  this._onClaimsUpdated();
              }.bind(this), function () { this.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true })); }.bind(this));
          }.bind(this), function() { this.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true })); }.bind(this));
      }
      else {
          this.application = application;
          this._onApplicationAdded();

          this._saveClaims(application.meta.update_claims).then(function (applicationUpdated) {
              this.application = applicationUpdated;
              this._onClaimsUpdated();
          }.bind(this), function () { this.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true })); }.bind(this));
      }
  }

  /**
   * Configures application with given title and url.
   *
   * @returns {*}
   * @private
   */
  _submitApplicationConfigure(application) {
      var titleInput = this.$.title,
          urlInput = this.$.url;

      return new Promise(function(resolve, reject) {
          let body = encodeURIComponent(titleInput.name) + '=' + encodeURIComponent(titleInput.value);
          body += '&';
          body += encodeURIComponent(urlInput.name) + '=' + encodeURIComponent(urlInput.value);

          if('' !== body) {
              const options = {
                  url: application.self,
                  method: 'PATCH',
                  body: body,
                  handleAs: 'json',
                  headers: this._headers
              };

              const request = document.createElement('iron-request');
              request.send(options).then(function() {
                  if (request.succeeded) {
                      resolve(request.response);
                  }
              });
          } else {
              reject(false);
          }
      }.bind(this));
  }

  _saveClaims(claimsUri) {
      return new Promise(function(resolve, reject) {
          let body = encodeURIComponent('application_claims[claim_type]') + '=' + encodeURIComponent(this._claimTypeIndividual);
          if (!this._claimTypeIndividual) {
              body += body === '' ? '' : '&';
              body += this._applicationClaimsActiveForm.encodedBodyValues();
          }

          if ('' !== body) {
              const options = {
                  url: claimsUri,
                  method: 'PATCH',
                  body: body,
                  handleAs: 'json',
                  headers: this._headers
              };

              const request = document.createElement('iron-request');
              request.send(options).then(function () {
                      if (request.succeeded) {
                          resolve(request.response);
                      }
                  }
              );
          } else {
              reject(false);
          }
      }.bind(this));
  }

  /**
   * Called on form error when trying to add new application as icon.
   *
   * @param {Object} event
   * @private
   */
  _onFormError(event) {
      this._errorMessage = event.detail.error.message;
      this.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true }));
  }

  /**
   * Called after application is added as icon.
   * It calls application configure method.
   *
   * @param {Object} event
   * @private
   */
  _onFormResponse(event) {
      const applications = event.detail.response.applications;

      if (applications && applications.length > 0) {
          this._updateApplicationSettings(applications[0]);
      }
  }

  addApplication() {
      if (this._claimsFormActive
          && this._applicationClaimsActiveForm
          && false === this._applicationClaimsActiveForm.isValid()
      ) {
          this.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true }));
          return;
      }

      if (this._applicationConfigurationForm.validate()) {
          this._applicationForm.submit();
      } else {
          this.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true }));
      }
  }

  _onApplicationAdded() {
      this.dispatchEvent(new CustomEvent('application-added', {
          bubbles: true,
          composed: true,
          detail: {
              application: this.application
          }
      }));
  }

  _onClaimsUpdated() {
      this.dispatchEvent(new CustomEvent('application-claims-updated', {
          bubbles: true,
          composed: true,
          detail: {
              application: this.application
          }
      }));
  }

  reset() {
      this._claimTypeIndividual = false;
      if (this._applicationClaimsActiveForm && this._applicationClaimsActiveForm.$) {
          this._applicationClaimsActiveForm.reset();
      }
      this._applicationConfigurationForm.reset();
      this._applicationClaimsForm.reset();
  }
}
window.customElements.define(AppscoCompanyApplicationAddSettings.is, AppscoCompanyApplicationAddSettings);
