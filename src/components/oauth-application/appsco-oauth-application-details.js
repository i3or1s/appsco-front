import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOAuthApplicationDetails extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                @apply --appsco-oauth-application-details;
                display: none;
            }
            :host .attribute-container {
                margin: 6px 0;
            }
            :host .label {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --application-details-label;
            }
            :host .content {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                @apply --application-details-value;
            }
            :host .value {
                @apply --paper-font-common-nowrap;
            }
            :host .flex {
                @apply --layout-flex;
            }
        </style>

        <div class="attribute-container">
            <div class="label">Title</div>
            <div class="content">
                <div class="value flex">
                    [[ application.title ]]
                </div>
            </div>
        </div>

        <template is="dom-if" if="[[ application.redirect_url ]]">
            <div class="attribute-container">
                <div class="label">Redirect URL</div>
                <div class="content">
                    <div class="value flex">
                        [[ application.redirect_url ]]
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ application.website_url ]]">
            <div class="attribute-container">
                <div class="label">Website URL</div>
                <div class="content">
                    <div class="value flex">
                        [[ application.website_url ]]
                    </div>
                </div>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-oauth-application-details'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          animationConfig: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  duration: 500
              }
          },
          'exit': {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 100
              }
          }
      };

      afterNextRender(this, function() {
          this._showApplicationDetails();
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('application-changed', this._onApplicationChanged);
  }

  _onApplicationChanged() {
      this._showApplicationDetails();
  }

  _showApplicationDetails() {
      this.style.display = 'block';
      this.playAnimation('entry');
  }
}
window.customElements.define(AppscoOAuthApplicationDetails.is, AppscoOAuthApplicationDetails);
