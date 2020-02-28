import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/shadow.js';
import './appsco-oauth-application-certificates.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOAuthApplicationCertificatesPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --appsco-list-item-activated: {
                    @apply --shadow-elevation-2dp;
                };

                --appsco-list-item: {
                    background-color: var(--body-background-color);
                    cursor: auto;
                };

                --certificate-icon-background-color: var(--body-background-color-darker);
            }
            :host paper-card {
                @apply --full-page-paper-card;
            }
            .page-close-action {
                @apply --page-close-action;
            }
            :host paper-button {
                @apply --primary-button;
                display: inline-block;
            }
            :host .certificate-list {
                margin-top: 20px;
            }
        </style>

        <paper-card heading="Certificates" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content layout vertical">
                <paper-button on-tap="_onAddCertificateAction">Add certificate</paper-button>

                <appsco-oauth-application-certificates id="appscoOAuthApplicationCertificates" class="certificate-list" type="certificate" authorization-token="[[ authorizationToken ]]" list-api="[[ certificatesApi ]]" api-errors="[[ apiErrors ]]" size="10" load-more="" on-remove-item="_onRemoveCertificateAction"></appsco-oauth-application-certificates>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-oauth-application-certificates-page'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          certificatesApi: {
              type: String
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
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

  reloadCertificates() {
      this.$.appscoOAuthApplicationCertificates.reloadItems();
  }

  _onClosePageAction() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  _onAddCertificateAction() {
      this.dispatchEvent(new CustomEvent('add-oauth-application-certificate', {
          bubbles: true,
          composed: true,
          detail: {
              application: this.application
          }
      }));
  }

  _onRemoveCertificateAction(event) {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('remove-oauth-application-certificate', {
          bubbles: true,
          composed: true,
          detail: {
              certificate: event.detail.item
          }
      }));
  }
}
window.customElements.define(AppscoOAuthApplicationCertificatesPage.is, AppscoOAuthApplicationCertificatesPage);
