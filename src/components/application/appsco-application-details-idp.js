import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationDetailsIdp extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --application-details-label;
            }

            :host div[content] {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                @apply --application-details-value;
            }

            :host .flex {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
            }

            :host > div {
                margin: 6px 0;
            }
            :host .download-action {
                margin: 0;
            }
        </style>

        <template is="dom-if" if="[[ idpMetadata.signInUrl ]]">
            <div>
                <div label="">Sign in URL</div>
                <div content="">
                    <div class="flex">
                        [[ idpMetadata.signInUrl ]]
                    </div>
                    <div>
                        <appsco-copy value="[[ idpMetadata.signInUrl ]]" name="signInUrl"></appsco-copy>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.signOutUrl ]]">
            <div>
                <div label="">Sign out URL</div>
                <div content="">
                    <div class="flex">
                        [[ idpMetadata.signOutUrl ]]
                    </div>
                    <div>
                        <appsco-copy value="[[ idpMetadata.signOutUrl ]]" name="signOutUrl"></appsco-copy>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.errorUrl ]]">
            <div>
                <div label="">Error URL</div>
                <div content="">
                    <div class="flex">
                        [[ idpMetadata.errorUrl ]]
                    </div>
                    <div>
                        <appsco-copy value="[[ idpMetadata.errorUrl ]]" name="errorUrl"></appsco-copy>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.resetPasswordUrl ]]">
            <div>
                <div label="">Reset password URL</div>
                <div content="">
                    <div class="flex">
                        [[ idpMetadata.resetPasswordUrl ]]
                    </div>
                    <div>
                        <appsco-copy value="[[ idpMetadata.resetPasswordUrl ]]" name="resetPasswordUrl"></appsco-copy>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.entityId ]]">
            <div>
                <div label="">Entity ID</div>
                <div content="">
                    <div class="flex">
                        [[ idpMetadata.entityId ]]
                    </div>
                    <div>
                        <appsco-copy value="[[ idpMetadata.entityId ]]" name="entityId"></appsco-copy>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.cert.fingerprint ]]">
            <div>
                <div label="">Certificate fingerprint [sha1]</div>
                <div content="">
                    <div class="flex">
                        [[ idpMetadata.cert.fingerprint ]]
                    </div>
                    <div>
                        <appsco-copy value="[[ idpMetadata.cert.fingerprint ]]" name="fingerprint"></appsco-copy>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.cert.sha256Fingerprint ]]">
            <div>
                <div label="">Certificate fingerprint [sha256]</div>
                <div content="">
                    <div class="flex">
                        [[ idpMetadata.cert.sha256Fingerprint ]]
                    </div>
                    <div>
                        <appsco-copy value="[[ idpMetadata.cert.sha256Fingerprint ]]" name="fingerprint"></appsco-copy>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.cert ]]">
            <div>
                <div label="">Download</div>
                <div content="">
                    <div class="flex">
                        Certificate
                    </div>
                    <div>
                        <paper-icon-button class="download-action" icon="icons:file-download" on-tap="_onDownloadCertificate">
                        </paper-icon-button>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ idpMetadata.metadataUrl ]]">
            <div>
                <div label="">Download</div>
                <div content="">
                    <div class="flex">
                        IdP metadata
                    </div>
                    <div>
                        <paper-icon-button class="download-action" icon="icons:file-download" on-tap="_onDownloadMetadataXml">
                        </paper-icon-button>
                    </div>
                </div>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-application-details-idp'; }

  static get properties() {
      return {
          idpMetadata: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          }
      };
  }

  _onDownloadCertificate(event) {
      event.preventDefault();
      window.location.href = this.idpMetadata.certificateUrl;
  }

  _onDownloadMetadataXml(event) {
      event.preventDefault();
      window.location.href = this.idpMetadata.metadataUrl + '?download=1';
  }
}
window.customElements.define(AppscoApplicationDetailsIdp.is, AppscoApplicationDetailsIdp);
