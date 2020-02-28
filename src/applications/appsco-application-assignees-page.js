import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '../components/application/company/appsco-application-assignees.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationAssigneesPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --item-background-color: var(--body-background-color);
                --subscriber-initials-background-color: var(--body-background-color-darker);
            }
            :host paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    @apply --full-page-paper-card-header-text;
                };
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

        <paper-card heading="Assignees" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">

                <template is="dom-if" if="[[ !_assigneesEmpty ]]">
                    <div class="info">
                        <p>If resource is set to be configured individually by employees you are able to change claims for every employee.</p>
                        <p>If resource is set to be configured by administrator you are able to change claims for all employees in section Sharing Settings.</p>
                    </div>
                </template>

                <appsco-application-assignees id="appscoApplicationAssignees" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" size="10" auto-load="" load-more="" on-assignees-empty="_onAssigneesEmpty" on-assignees-loaded="_onAssigneesLoaded"></appsco-application-assignees>

            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-application-assignees-page'; }

  static get properties() {
      return {
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

          _assigneesEmpty: {
              type: Boolean,
              value: false
          },

          animationConfig: {
              type: Object
          },

          sharedElements: {
              type: Object
          }
      };
  }

  ready(){
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

  _onAssigneesEmpty() {
      this._assigneesEmpty = true;
  }

  _onAssigneesLoaded() {
      this._assigneesEmpty = false;
  }

  reloadAssignees() {
      this.$.appscoApplicationAssignees.reload();
  }

  searchAssignees(term) {
      this.$.appscoApplicationAssignees.search(term);
  }

  removeAssignee(assignee) {
      this.shadowRoot.getElementById('appscoApplicationAssignees').removeAssignee(assignee);
  }

  _back() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  setupPage() {
      this.dispatchEvent(new CustomEvent('enable-assignees-search-action', { bubbles: true, composed: true }));
  }

  resetPage() {
      this.dispatchEvent(new CustomEvent('disable-assignees-search-action', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoApplicationAssigneesPage.is, AppscoApplicationAssigneesPage);
