import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './appsco-company-idp-domains.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyIdpDomainsPage extends PolymerElement {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --item-background-color: var(--body-background-color);
                --domains-progress-bar: {
                    top: -10px;
                };
            }
            paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    color: var(--primary-text-color);
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
            .message {
                @apply --info-message;
            }
            .emphasized {
                font-weight: 500;
            }
        </style>

        <paper-card heading="IdP settings for domains" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content">
                <template is="dom-if" if="[[ _showDomains ]]">
                    <p>Enter information provided by the identity provider.</p>
                    <p>
                        Please remember the following URL:
                        <span class="emphasized">https://appsco.com/force/login</span>.
                        As administrator you can use this URL to login with your AppsCo username and password
                        in case there is an issue with the IdP login.
                    </p>

                    <appsco-company-idp-domains id="appscoCompanyIdPDomains" domains-api="[[ domainsApi ]]" authorization-token="[[ authorizationToken ]]" size="100" on-loaded="_onCompanyIdPDomainsLoaded" on-empty-load="_onCompanyIdPDomainsEmptyLoad"></appsco-company-idp-domains>
                </template>

                <template is="dom-if" if="[[ _showMessage ]]">
                    <p class="message">
                        There are no verified domains. Only verified domains can be set up with external IDP functionality.
                    </p>
                </template>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-company-idp-domains-page'; }

  static get properties() {
      return {
          authorizationToken: {
              type: String,
              value: ''
          },

          domainsApi: {
              type: String
          },

          _showDomains: {
              type: Boolean,
              value: true
          },

          _showMessage: {
              type: Boolean,
              value: false
          }
      };
  }

  reloadDomains() {
      this.shadowRoot.getElementById('appscoCompanyIdPDomains').reloadDomains();
  }

  modifyDomain(domain) {
      this.shadowRoot.getElementById('appscoCompanyIdPDomains').modifyDomain(domain);
  }

  _onCompanyIdPDomainsLoaded() {
      this._showDomains = true;
      this._showMessage = false;
  }

  _onCompanyIdPDomainsEmptyLoad() {
      this._showDomains = false;
      this._showMessage = true;
  }

  _onClosePageAction() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoCompanyIdpDomainsPage.is, AppscoCompanyIdpDomainsPage);
