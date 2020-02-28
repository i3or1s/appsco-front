import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoIntegrationRulesCard extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
                @apply --appsco-integration-rules-card;
            }
            .info {
                @apply --info-message;
            }
        </style>

        <div>
            <p class="info">
                Rules represent templates according to which AppsCo will interact with the integrated system.
            </p>
            <p class="info">
                Each rule will run on its own. A Rule is divided into two sections.
                </p><ul>
                    <li>
                        First part of the rule is a reaction to an event, such as "user added" or "user removed", or can
                        execute a query to the integrated system, such as "retrieve all users".
                    </li>
                    <li>
                        Second part of the rule represents an action that should be performed on the underlying system. These
                        actions range from "add user", "user modified" to "group added" (actions are defined by the underlying system).
                    </li>
                </ul>
            <p></p>
            <p class="info">
                Rules can be tied to webhooks in such way that "First part" of the rule reacts to webhook event,
                thus making a connection between the integrating system and AppsCo.
            </p>
        </div>
`;
  }

  static get is() { return 'appsco-integration-rules-card'; }

  static get properties() {
      return {
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
          this._showRulesDetails();
      });
  }

  _showRulesDetails() {
      this.style.display = 'block';
      this.playAnimation('entry');
  }
}
window.customElements.define(AppscoIntegrationRulesCard.is, AppscoIntegrationRulesCard);
