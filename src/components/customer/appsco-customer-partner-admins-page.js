import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './appsco-customer-partner-admins.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCustomerPartnerAdminsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --appsco-company-partner-admin-item: {
                     background-color: var(--body-background-color);
                 };
                --partner-admin-initials-background-color: var(--body-background-color-darker);
            }
            :host paper-card {
                @apply --full-page-paper-card;
            }
            .page-close-action {
                @apply --page-close-action;
            }
            .info p {
                margin-top: 5px;
                margin-bottom: 0;
            }
            .info {
                margin-bottom: 20px;
            }
        </style>

        <paper-card heading="Partner admins" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content layout vertical">

                <template is="dom-if" if="[[ !_applicationsEmpty ]]">
                    <div class="info">
                        <p>List of all users added to this customer. </p>
                    </div>
                </template>

                <appsco-customer-partner-admins id="appscoCustomerPartnerAdmins" customer="[[ customer ]]" list-api="[[ partnerAdminsApi ]]" authorization-token="[[ authorizationToken ]]" size="10" load-more="" auto-load-active=""></appsco-customer-partner-admins>

            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-customer-partner-admins-page'; }

  static get properties() {
      return {
          customer: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          partnerAdminsApi: {
              type: String
          },

          authorizationToken: {
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
              toPage: this
          }, {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  duration: 600
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

  loadPage() {
      this.$.appscoCustomerPartnerAdmins.loadPartnerAdmins();
  }

  reloadPartnerAdmins() {
      this.$.appscoCustomerPartnerAdmins.reloadPartnerAdmins();
  }

  removePartnerAdmins(partnerAdmins) {
      this.$.appscoCustomerPartnerAdmins.removePartnerAdmins(partnerAdmins);
  }

  _onClosePageAction() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoCustomerPartnerAdminsPage.is, AppscoCustomerPartnerAdminsPage);
