import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './appsco-company-domains.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyDomainsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
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
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Domains" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onBack"></paper-icon-button>

            <div class="card-content">
                <appsco-company-domains id="appscoCompanyDomains" authorization-token="[[ authorizationToken ]]" domains-api="[[ domainsApi ]]" size="10" load-more="" on-loaded="_onDomainsLoaded" on-empty-load="_onNoDomainsLoaded" on-remove="_onRemoveDomain"></appsco-company-domains>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-company-domains-page'; }

  static get properties() {
      return {
          authorizationToken: {
              type: String
          },

          domainsApi: {
              type: String
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

  _onBack() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  addDomain(domain) {
      this.$.appscoCompanyDomains.addDomain(domain);
  }

  modifyDomain(domain) {
      this.$.appscoCompanyDomains.modifyDomain(domain);
  }

  removeDomain(domain) {
      this.$.appscoCompanyDomains.removeDomain(domain);
  }

  setupPage() {
      this.dispatchEvent(new CustomEvent('show-domains-page-actions', { bubbles: true, composed: true }));
  }

  resetPage() {
      this.dispatchEvent(new CustomEvent('hide-domains-page-actions', { bubbles: true, composed: true }));
  }

  _onRemoveDomain(event) {
      this.dispatchEvent(new CustomEvent('remove-domain', {
          bubbles: true,
          composed: true,
          detail: {
              domain: event.detail.domain
          }
      }));
  }

  _onDomainsLoaded() {
      this.dispatchEvent(new CustomEvent('company-domains-loaded', {bubbles: true, composed: true}));
  }

  _onNoDomainsLoaded() {
      this.dispatchEvent(new CustomEvent('empty-company-domains-loade', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoCompanyDomainsPage.is, AppscoCompanyDomainsPage);
