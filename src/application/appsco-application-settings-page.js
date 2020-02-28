import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../components/application/appsco-application-settings.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationSettingsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };
            }
            :host paper-card {
                @apply --full-page-paper-card;
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Settings" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">
                <appsco-application-settings company="[[ company ]]" id="appscoApplicationSettings" application="{{ application }}" authorization-token="[[ authorizationToken ]]" form-submit-action=""></appsco-application-settings>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-application-settings-page'; }

  static get properties() {
      return {
          /**
           * Selected application from search list.
           */
          application: {
              type: Object,
              notify: true
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          company: {
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

  _back() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  setPage() {
      this.$.appscoApplicationSettings.setUp();
  }

  resetPage() {
      this.$.appscoApplicationSettings.reset();
  }
}
window.customElements.define(AppscoApplicationSettingsPage.is, AppscoApplicationSettingsPage);
