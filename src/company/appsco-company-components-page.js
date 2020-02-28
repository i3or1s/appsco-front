import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-company-details.js';
import './appsco-company-brand-details.js';
import './appsco-company-domains.js';
import '../components/page/appsco-layout-with-cards-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyComponentsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-layout-with-cards-styles">
            :host {
                font-size: 14px;
                color: var(--primary-text-color);

                --company-details-label: {
                    font-size: 12px;
                    line-height: 16px;
                };
                --company-details-value: {
                    font-size: 14px;
                    line-height: 22px;
                };
            }
            appsco-company-details {
                --company-detail-container: {
                     margin: 4px 0;
                 };
            }
            appsco-company-brand-details {
                --company-logo: {
                    padding: 5px;
                    background-color: var(--body-background-color);
                };
            }
            :host .message {
                @apply --info-message;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="cols-layout three-cols-layout">
            <div class="col">
                <paper-card heading="Settings" id="companySettingsCard" class="appsco-company-details">
                    <div class="card-content">
                        <appsco-company-details company="[[ company ]]"></appsco-company-details>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageCompanySettings" id="companySettingsCardBtn">Manage</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="Transfer Token" class="transfer-token">
                    <div class="card-content card-content-no-padding">
                        <p class="message">
                            Generate transfer token in order to enable the partner to add your company as a customer.
                        </p>
                    </div>
                    <div class="card-actions">
                        <paper-button on-tap="_onManageTransferToken">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Domains" id="companySettingsDomainsCard" class="appsco-company-domains">
                    <div class="card-content">
                        <appsco-company-domains id="appscoCompanyDomains" domains-api="[[ domainsApi ]]" authorization-token="[[ authorizationToken ]]" size="5" preview="" on-empty-load="_onDomainsEmptyLoad"></appsco-company-domains>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageCompanyDomains" id="companySettingsDomainsCardButton">Manage</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="IdP Settings" id="companySettingsManageIdpCard">
                    <div class="card-content">
                        <p class="message">
                            Configure Identity Provider for your verified domains.
                        </p>
                        <p class="message">
                            You can set up one IdP per domain.
                            To setup an IdP, enter the information provided by the Identity Provider.
                        </p>
                    </div>

                    <div class="card-actions">
                        <paper-button id="companySettingsManageIdpCardBtn" on-tap="_onManageCompanyIdPSettings">
                            Manage
                        </paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">

                <paper-card heading="Branding" class="appsco-company-brand-details" id="companySettingsBrandingCard">
                    <div class="card-content">
                        <appsco-company-brand-details company="[[ company ]]"></appsco-company-brand-details>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageCompanyBrandSettings" id="companySettingsBrandingCardBtn">Manage</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="Branded Login" id="companySettingsBrandedLoginCard">
                    <div class="card-content">
                        <p class="message">
                            Customize login form for your company and add your own branding.
                        </p>
                    </div>

                    <div class="card-actions">
                        <paper-button id="companySettingsBrandedLoginCardBtn" on-tap="_onManageCompanyBrandedLogin">Manage</paper-button>
                    </div>
                </paper-card>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-company-components-page'; }

  static get properties() {
      return {
          company: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String
          },

          domainsApi: {
              type: String
          },

          mediumScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          tabletScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          brandLogo: {
              type: String,
              value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAgCAYAAAB+ZAqzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVZJREFUeNrsmOENgjAQhcE4AG5QN2AERnCEjsAIdQJG6AiO0BEcATdwhLONxJR6V1u8Ij98ycXkrL3HR+8gVlWCAEDa0EjuaqP1csLGkPJ7FtlNR3hKIzknNeV0uC5YqzhNSc/AiORgKiyCnCbWSm5ar02DHEzFhyB3J9aCf/tL02qckSCvbHSAy60Va9BSSGFn1gAt1zjNlmj5Mr+gdYE0aXZahFmFdOgnSW5aEikivHmWo1NJWnoBLf8ItFujNWumErSwDs3V+xjJoNURtBTwSC6lZQrRmtXhoNXa6IFPIwctE3lYf3crv6TVER26Ki29RVpiNVoJkz+FlmGnlTD5Y7ROia82q9Iat0ALG5xyml3laUXMqkSKZWgRpiha4k+LMPYzWvuYsbquDxhFxn8fzmTt3DNnP9xVNgymbvbCj9SXu8zNeiZTUVocZ27pe/3HA/8QYABzJAP50CmRFwAAAABJRU5ErkJggg=='
          },

          animationConfig: {
              type: Object
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(tabletScreen, mediumScreen)'
      ];
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': [{
              name: 'cascaded-animation',
              animation: 'fade-in-animation',
              nodes: dom(this.root).querySelectorAll('paper-card'),
              nodeDelay: 50,
              timing: {
                  delay: 200,
                  duration: 100
              }
          }],
          'exit': [{
              name: 'hero-animation',
              id: 'hero',
              fromPage: this
          }, {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 500
              }
          }]
      };

      beforeNextRender(this, function() {
          if (this.tabletScreen || this.mediumScreen) {
              this.updateStyles();
          }
      });
  }

  _updateScreen(tablet, medium) {
      this.updateStyles();
  }

  setSharedElement(target, callback) {
      if ('domains' === target) {
          this.sharedElements = {
              'hero': this.$.appscoCompanyDomains
          };
      }
  }

  _setSharedElement(target) {
      while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
          target = target.parentNode;
      }

      this.sharedElements = {
          'hero': target
      };
  }

  addDomain(domain) {
      this.$.appscoCompanyDomains.addDomain(domain, true);
  }

  modifyDomain(domain) {
      this.$.appscoCompanyDomains.modifyDomain(domain);
  }

  removeDomain(domain) {
      this.$.appscoCompanyDomains.removeDomain(domain);
  }

  addGroup(group) {
      this.$.appscoCompanyGroups.addGroup(group, true);
  }

  removeGroup(group) {
      this.$.appscoCompanyGroups.removeGroup(group);
  }

  _onManageCompanySettings(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-company-settings', { bubbles: true, composed: true }));
  }

  _onManageCompanyBrandSettings(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-company-brand-settings', { bubbles: true, composed: true }));
  }

  _onManageCompanyBrandedLogin(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-company-branded-login', { bubbles: true, composed: true }));
  }

  _onManageCompanyDomains(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-company-domains', { bubbles: true, composed: true }));
  }

  _onManageTransferToken(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-company-transfer-token', { bubbles: true, composed: true }));
  }

  _onManageCompanyIdPSettings(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-company-idp-settings', { bubbles: true, composed: true }));
  }

  _onDomainsEmptyLoad() {
      this.dispatchEvent(new CustomEvent('loaded', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoCompanyComponentsPage.is, AppscoCompanyComponentsPage);
