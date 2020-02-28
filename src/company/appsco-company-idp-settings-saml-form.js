import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@vaadin/vaadin-upload/vaadin-upload.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import './appsco-company-idp-settings-certificates.js';
import { AppscoCompanyIdpSettingsFormBehavior } from './appsco-company-idp-settings-form-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyIdpSettingsSamlForm extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoCompanyIdpSettingsFormBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host .info {
                margin-bottom: 0;
            }
            :host .info-inner {
                margin-top: 20px;
                font-weight: 500;
            }
            vaadin-upload {
                --primary-color: var(--app-primary-color-dark);

                --vaadin-upload-button-add: {
                    @apply --primary-button;
                };
            }
        </style>
        
        <paper-input id="appId" label="App ID" data-field="" name="[[ formPrefix ]][appId]" value="[[ idPConfig.idpAppId ]]" required="" error-message="Please type in app ID." on-keyup="_onKeyUp"></paper-input>

        <p class="info info-inner">Upload IdP metadata XML file:</p>

        <vaadin-upload id="uploadIdpMetadataField" no-auto="" max-files="1" max-file-size="1000000" accept=".xml, text/xml, application/xml" on-upload-before="_onUploadIdPMetadataBefore">
            <div class="drop-label">
                <iron-icon icon="icons:file-upload"></iron-icon>
                Upload IdP metadata XML file
            </div>
        </vaadin-upload>

        <p class="info info-inner">Or enter values manually:</p>

        <paper-input label="Sign in URL" data-field="" name="[[ formPrefix ]][idpSSOUrl]" value="[[ idPConfig.idpSSOUrl ]]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" error-message="Please type in sign in URL in proper format." on-keyup="_onKeyUp"></paper-input>

        <paper-input label="Entity ID" data-field="" name="[[ formPrefix ]][idpEntityId]" value="[[ idPConfig.idpEntityId ]]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" error-message="Please type in entity ID." on-keyup="_onKeyUp"></paper-input>

        <appsco-company-idp-settings-certificates id="appscoCompanyIdpSettingsCertificates" name="default" certificates="[[ idPConfig.certs ]]" on-idp-certificate-added="_onCertAdded"></appsco-company-idp-settings-certificates>
`;
  }

  static get is() { return 'appsco-company-idp-settings-saml-form'; }

  static get properties() {
      return {
          uploadIdpMetadataField: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this.uploadIdpMetadataField = this.$.uploadIdpMetadataField;

      afterNextRender(this, function () {
          this.uploadIdpMetadataField.set('i18n.addFiles.many', 'Upload file');
      });
  }

  getEncodedBodyValues() {
      const certificates = this.getCertificates();
      let body = '';

      dom(this.root).querySelectorAll('[data-field]').forEach(function(item) {
          if (item.value) {
              body += body === '' ? '' : '&';
              body += encodeURIComponent(item.name) + '=' + encodeURIComponent(item.value);
          }
      }.bind(this));

      for (let i = 0; i < certificates.length; i++) {
          body += ('&' + this.formPrefix + '[certs][' + i + ']=' + encodeURIComponent(certificates[i]));
      }

      return body;
  }

  getCertificates() {
      return this.$.appscoCompanyIdpSettingsCertificates.getCertificates();
  }

  reset() {
      dom(this.root).querySelectorAll('[data-field]').forEach(function(item) {
          const inputContainer = item.shadowRoot.getElementById('#container');

          item.value = '';
          item.invalid = false;

          // Used because gold-cc-input doesn't send 'invalid' property down to children elements
          if (inputContainer) {
              inputContainer.invalid = false;
          }
      }.bind(this));

      this.uploadIdpMetadataField.files = [];
  }

  _onCertAdded() {
      this.dispatchEvent(new CustomEvent('hide-error', { bubbles: true, composed: true }));
  }

  _onUploadIdPMetadataBefore(event) {
      // Prevent AJAX request
      event.preventDefault();

      const file = event.detail.file,
          uploadField = this.uploadIdpMetadataField,
          fileIndex = uploadField.files.indexOf(file);

      // Update UI
      uploadField.set(['files', fileIndex, 'progress'], 100);
      uploadField.set(['files', fileIndex, 'complete'], true);

      this._parseIdPMetadataXMLFile(file);
  }

  _parseIdPMetadataXMLFile(file) {
      const reader = new FileReader();

      (function(me) {

          reader.onload = function(a, b, c) {
              const xmlDocument = new DOMParser().parseFromString(this.result, 'text/xml');

              me._fillIdPMetadataFromXML(xmlDocument);
          };
      })(this);

      reader.readAsText(file);
  }

  _fillIdPMetadataFromXML(xmlDocument) {
      let idpEntityDescriptor = xmlDocument.querySelector('[entityID]'),
          entityId = idpEntityDescriptor.getAttribute('entityID'),
          certificateDOM = xmlDocument.getElementsByTagName('X509Certificate'),
          singleSignOnServices = xmlDocument.querySelectorAll('SingleSignOnService'),
          length = singleSignOnServices.length,
          signInURL,
          certificates = [];

      if (!certificateDOM || certificateDOM.length === 0) {
          certificateDOM = xmlDocument.getElementsByTagName('ds:X509Certificate');
      }

      for (let i = 0; i < length; i++) {
          const singleSignOnService = singleSignOnServices[i];

          if (-1 !== singleSignOnService.getAttribute('Binding').indexOf('HTTP-Redirect')) {
              signInURL = singleSignOnService.getAttribute('Location');
              break;
          }
      }

      for (let i = 0; i < certificateDOM.length; i++) {
          certificates.push(certificateDOM[i].textContent);
      }

      this._setIdPConfig(signInURL, entityId, certificates);
  }

  _setIdPConfig(signInURL, entityId, certificates) {
      const config = JSON.parse(JSON.stringify(this.idPConfig));

      config.idpSSOUrl = signInURL;
      config.idpEntityId = entityId;

      config.certs = [];
      for (let i = 0; i < certificates.length; i++) {
          config.certs.push(
              '-----BEGIN CERTIFICATE-----\n' +
              certificates[i] +
              '\n-----END CERTIFICATE-----'
          );
      }

      this.set('idPConfig', {});
      this.set('idPConfig', config);
  }
}
window.customElements.define(AppscoCompanyIdpSettingsSamlForm.is, AppscoCompanyIdpSettingsSamlForm);
