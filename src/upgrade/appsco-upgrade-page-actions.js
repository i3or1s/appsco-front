import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/shadow.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoUpgradePageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            :host .pricing-button {
                @apply --primary-button;
                width: 120px;
                display: none;
            }
            :host .pricing-button[active] {
                @apply --primary-button-active;
            }
            :host([tablet-s768-screen]) .pricing-button {
                display: block;
            }
        </style>

        <iron-media-query query="(max-width: 768px)" query-matches="{{ tabletS768Screen }}"></iron-media-query>

        <paper-button class="pricing-button" on-tap="_onPricingAction" toggles="" active="">Pricing</paper-button>
`;
  }

  static get is() { return 'appsco-upgrade-page-actions'; }

  static get properties() {
      return {
          tabletS768Screen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
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
                  delay: 300,
                  duration: 300
              }
          },
          'exit': {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 200
              }
          }
      };
  }

  _backToHome() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  _onPricingAction() {
      this.dispatchEvent(new CustomEvent('toggle-pricing', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoUpgradePageActions.is, AppscoUpgradePageActions);
