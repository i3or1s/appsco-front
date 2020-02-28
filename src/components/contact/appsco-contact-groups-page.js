import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import './appsco-contact-groups.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoContactGroupsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
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
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Groups" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onBack"></paper-icon-button>

            <div class="card-content">
                <p class="message">
                    List of all groups the contact belongs to.
                </p>
                <appsco-contact-groups id="appscoContactGroup" authorization-token="[[ authorizationToken ]]" groups-api="[[ groupsApi ]]" contact="[[ contact ]]">
                </appsco-contact-groups>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-contact-groups-page'; }

  static get properties() {
      return {
          contact: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String
          },

          groupsApi: {
              type: String,
              'observer': '_onGroupsApiChange'
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

  _onGroupsApiChange() {
      this.loadGroups();
  }

  loadGroups() {
      this.$.appscoContactGroup.loadGroups();
  }

  removeGroup(group) {
      this.$.appscoContactGroup.removeGroup(group);
  }
}
window.customElements.define(AppscoContactGroupsPage.is, AppscoContactGroupsPage);
