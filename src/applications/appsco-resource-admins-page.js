import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '../components/application/company/appsco-resource-admins.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoResourceAdminsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --paper-card-header-text: {
                    @apply --full-page-paper-card-header-text;
                };

                --item-background-color: var(--body-background-color);
                --subscriber-initials-background-color: var(--body-background-color-darker);
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
            :host paper-button {
                @apply --primary-button;
                display: inline-block;
            }
        </style>

        <paper-card heading="Resource Admins" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">

                <div class="actions">
                    <paper-button on-tap="_addResourceAdmins">Add Resource Admin</paper-button>
                </div>

                <appsco-resource-admins id="appscoApplicationAssignees" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" size="10" auto-load="" load-more="" on-assignees-empty="_onAssigneesEmpty" on-assignees-loaded="_onAssigneesLoaded" on-revoke-assignee="_onRevokeAssignee"></appsco-resource-admins>

            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-resource-admins-page'; }

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

  _onRevokeAssignee (event) {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('revoke-resource-admin', {
          bubbles: true,
          composed: true,
          detail: {
              assignee: event.detail.assignee,
              application: this.application
          }
      }));
  }

  reload() {
      this.reloadAssignees();
  }

  reloadAssignees() {
      this.$.appscoApplicationAssignees.reload();
  }

  searchAssignees(term) {
      this.$.appscoApplicationAssignees.search(term);
  }

  removeAssignee(assignee) {
      this.$.appscoApplicationAssignees.removeAssignee(assignee);
  }

  _addResourceAdmins() {
      this.dispatchEvent(new CustomEvent('add-resource-admin', {
          bubbles: true,
          composed: true,
          detail: {
              resource: this.application
          }
      }));
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
window.customElements.define(AppscoResourceAdminsPage.is, AppscoResourceAdminsPage);
