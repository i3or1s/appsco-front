import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoTutorialCard extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles"></style>

        <style>
            :host {
                width: 100%;
                margin-bottom: 10px;
            }
            :host .info-value {
                font-size: 14px;
            }
            :host a {
                text-decoration: none;
                color: inherit;
            }
            :host .item-basic-info .info-value {
                overflow: visible;
            }
            :host .item[done] {
                background-color: #e0e0e0;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" done\$="[[ _isDone ]]" on-tap="_onItemAction">
            <iron-icon icon="[[ tutorial.icon ]]" item-icon=""></iron-icon>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ tutorial.tutorialTitle ]]</span>
                <span class="info-value">[[ tutorial.description ]]</span>
            </div>

            <div class="actions">
                <template is="dom-if" if="[[ tutorial.readme ]]">
                    <paper-button><a target="_blank" href="[[ tutorial.readme ]]">Read more</a></paper-button>
                </template>
                <template is="dom-if" if="[[ _isDone ]]">
                    <paper-button on-tap="_onStartAction">Replay</paper-button>
                </template>
                <template is="dom-if" if="[[ !_isDone ]]">
                    <paper-button on-tap="_onStartAction">[[ _startCaption ]]</paper-button>
                </template>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-tutorial-card'; }

  static get properties() {
      return {
          tutorial: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          tabletScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          _isDone: {
              type: Boolean,
              value: false,
              computed: '_isTutorialDone(tutorial)'
          },

          index: {
              type: Number,
              value: 0
          },

          firstUnfinishedIndex: {
              type: Number,
              value: 0
          },

          _startCaption: {
              type: String,
              value: 'Start',
              computed: '_computeStartCaption(index, firstUnfinishedIndex)'
          }
      };
  }

  _onStartAction(evt) {
      let scrollElement = document.querySelector('* app-header-layout #contentContainer');
      if(null === scrollElement) {
          scrollElement = document.querySelector('* /deep/ app-header-layout /deep/ #contentContainer');
      }
      if (scrollElement) {
          scrollElement.scrollTop = 0;
      }
      this.dispatchEvent(new CustomEvent('tutorial-start', {
          bubbles: true,
          composed: true,
          detail: {
              tutorialId: this.tutorial.id
          }
      }));
  }

  _isTutorialDone(tutorial) {
      return tutorial.isDone;
  }

  _computeStartCaption(index, firstUnfinishedIndex) {
      return index == firstUnfinishedIndex ? 'Start' : 'Next up';
  }
}
window.customElements.define(AppscoTutorialCard.is, AppscoTutorialCard);
