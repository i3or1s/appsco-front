import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-styles/shadow.js';
import './appsco-integration-resources.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoManageIdpPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --list-container: {
                    padding-top: 10px;
                };
                --appsco-list-progress-bar: {
                    display: block;
                };
                --appsco-list-item: {
                    cursor: auto;
                };
                --appsco-list-item-activated: {
                    @apply --shadow-elevation-2dp;
                };
                --item-background-color: var(--body-background-color);
            }
            :host paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    @apply --full-page-paper-card-header-text;
                };
            }
            :host .page-close-action {
                @apply --page-close-action;
            }
            :host .info {
                @apply --info-message;
            }
            :host appsco-integration-resources {
                margin-top: 20px;
            }
        </style>

        <paper-card heading="[[ idp.name ]]" id="pageCard">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onBack"></paper-icon-button>

            <div class="card-content">
                <p class="info">
                    Your company has set [[ idp.name ]] as an Identity Provider.
                    You can add different [[ idp.name ]] applications to your company's resources
                    and share them with your managed users.
                    The resources you share will show up on users' company dashboard.
                </p>
                <p class="info">
                    When managed users log in to AppsCo by using their [[ idp.name ]] identities,
                    they will be automatically logged in to all [[ idp.name ]] apps as well
                    and will be able to access them with just one click.
                </p>
                <appsco-integration-resources id="appscoIntegrationResources" type="resource" size="100" load-more="" authorization-token="[[ authorizationToken ]]" list-api="[[ _getAvailableResourcesApi ]]" api-errors="[[ apiErrors ]]">
                </appsco-integration-resources>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-manage-idp-page'; }

  static get properties() {
      return {
          idp: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          company: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _getAvailableResourcesApi: {
              type: String,
              computed: '_computeGetAvailableResourcesApi(idp, company)'
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
          'hero': this.$.pageCard
      };
  }

  modifyAddedResource(resource) {
      resource.exists = true;
      this.$.appscoIntegrationResources.modifyItems([resource]);
  }

  _computeGetAvailableResourcesApi(idp, company) {
      return (idp.alias && company.self) ?
          (company.self + '/applications/idp-available/' + idp.alias) :
          null;
  }

  _onBack() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoManageIdpPage.is, AppscoManageIdpPage);
