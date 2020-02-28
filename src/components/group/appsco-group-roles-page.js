import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import './appsco-company-group-roles.js';
import { AppscoGroupItemsPageBehavior } from './appsco-group-items-page-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoGroupRolesPage extends mixinBehaviors([AppscoGroupItemsPageBehavior, NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --appsco-company-group-role-item: {
                     background-color: var(--body-background-color);
                 };
                --group-role-initials-background-color: var(--body-background-color-darker);
            }
            :host paper-card {
                @apply --full-page-paper-card;
            }
            .page-close-action {
                @apply --page-close-action;
            }
            .add-action {
                @apply --primary-button;
                display: inline-block;
            }
            .group-item-list {
                margin-top: 20px;
            }
        </style>

        <paper-card heading="Users" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content layout vertical">

                <paper-button class="add-action" on-tap="_onAddToGroupAction">Add to group</paper-button>

                <appsco-company-group-roles id="appscoCompanyGroupItems" class="group-item-list" group="[[ group ]]" list-api="[[ groupRolesApi ]]" authorization-token="[[ authorizationToken ]]" size="10" load-more=""></appsco-company-group-roles>

            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-group-roles-page'; }

  static get properties() {
      return {
          groupRolesApi: {
              type: String
          },

          resourceType: {
              type: String,
              value: 'role'
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
}
window.customElements.define(AppscoGroupRolesPage.is, AppscoGroupRolesPage);
