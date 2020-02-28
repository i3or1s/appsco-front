import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '../components/integration/appsco-integration-rules.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoIntegrationRulesPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --item-background-color: var(--body-background-color);
                --rule-icon-background-color: var(--body-background-color-darker);

                --appsco-list-progress-bar: {
                    display: none;
                };
            }
            :host paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    padding: 16px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #414042;
                };
            }
            :host paper-button {
                @apply --primary-button;
                display: inline-block;
                min-width: 100px;
            }
            .page-close-action {
                @apply --page-close-action;
            }
            :host appsco-integration-rules {
                margin-top: 20px;
                display: block;
            }
        </style>

        <paper-card heading="Integration rules" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction">

            </paper-icon-button>

            <div class="card-content">
                <paper-button on-tap="_onAddAction">Add</paper-button>

                <appsco-integration-rules id="appscoIntegrationRules" integration="[[ integration ]]" list-api="[[ _integrationRulesApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" type="integration-rule" size="1000" on-edit-item="_onEditIntegrationRuleAction" on-run-item="_onRunIntegrationRuleAction" on-remove-item="_onRemoveIntegrationRuleAction">
                </appsco-integration-rules>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-integration-rules-page'; }

  static get properties() {
      return {
          integration: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _integrationRulesApi: {
              type: String,
              computed: '_computeIntegrationRulesApi(integration)'
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

  addIntegrationRule(rule) {
      this.$.appscoIntegrationRules.addItems([rule]);
  }

  modifyIntegrationRule(rule) {
      this.$.appscoIntegrationRules.modifyItems([rule]);
  }

  removeIntegrationRule(rule) {
      this.$.appscoIntegrationRules.removeItems([rule]);
  }

  _computeIntegrationRulesApi(integration) {
      return integration.meta ? integration.meta.recipes : null;
  }

  _onAddAction() {
      this.dispatchEvent(new CustomEvent('add-integration-rule', {
          bubbles: true,
          composed: true,
          detail: {
              integration: this.integration
          }
      }));
  }

  _onEditIntegrationRuleAction(event) {
      this.dispatchEvent(new CustomEvent('edit-integration-rule', {
          bubbles: true,
          composed: true,
          detail: {
              integration: this.integration,
              rule: event.detail.item
          }
      }));
  }

  _onRunIntegrationRuleAction(event) {
      this.dispatchEvent(new CustomEvent('run-integration-rule', {
          bubbles: true,
          composed: true,
          detail: {
              integration: this.integration,
              rule: event.detail.item
          }
      }));
  }

  _onRemoveIntegrationRuleAction(event) {
      this.dispatchEvent(new CustomEvent('remove-integration-rule', {
          bubbles: true,
          composed: true,
          detail: {
              integration: this.integration,
              rule: event.detail.item
          }
      }));
  }

  _onClosePageAction() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoIntegrationRulesPage.is, AppscoIntegrationRulesPage);
