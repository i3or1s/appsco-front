import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoTutorialProgress extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host .progress-container{
                background-color: var(--header-background-color);
                color: var(--header-text-color);
                position: absolute;
                top: 140px;
                right: 0px;
                z-index: 9000;
                opacity: 0.7;
                padding: 0;
                margin: 0;
                @apply --shadow-elevation-4dp;
                display:none;
            }
            :host .progress-container:hover{
                opacity:1;
            }
            .head{
                display: inline-block;
                padding: 5px 10px;
            }
            .head:first-child {
                border-right: 1px solid white;
            }
            .progress {
                border-top: 1px solid white;
                padding: 10px 10px 10px 6px;
            }
            .tut-item {
                padding: 5px;
            }
            .tut-name {
                padding: 10px 10px;
            }
        </style>
        <template is="dom-if" if="{{ isTutorialActive }}">
            <div class="progress-container" on-mouseover="_showProgressContent" on-mouseout="_hideProgressContent" hidden="[[ isTutorialActive ]]">
                <div>
                    <div class="head">{{ progress }}%</div>
                    <div class="head">AppsCo setup progress</div>
                </div>
                <div class="progress" hidden="[[ _hiddenContent ]]">
                    <template is="dom-repeat" items="{{ _tutorialsList }}">
                        <div class="tut-item">
                            <template is="dom-if" if="[[ item.done ]]">
                                <iron-icon icon="icons:check-circle"></iron-icon>
                            </template>
                            <template is="dom-if" if="[[ !item.done ]]">
                                <iron-icon icon="icons:radio-button-unchecked"></iron-icon>
                            </template>
                            <span class="tut-name">{{ item.name }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-tutorial-progress'; }

  static get properties() {
      return {
          _show: {
              type: Boolean,
              value: false,
              notify: true
          },

          progress: {
              type: Number,
              value: 0,
              reflectToAttribute: true,
              notify: true
          },

          tutorials: {
              type: Object,
              value: function () {
                  return {}
              },
              notify: true,
              observer: "_tutorialsChanged"
          },

          _hiddenContent: {
              type: Boolean,
              value: true
          },

          _tutorialsList: {
              type: Array,
              computed: "_computeTutorialsList(tutorials)"
          },

          isTutorialActive: {
              type: Boolean,
              value: false,
              notify: true,
              observer: '_isActiveChanged'
          }
      };
  }

  _tutorialsChanged(newValue, oldValue) {
      this.progress = 0;
      let finishedTuts = 0;
      let numOfTuts = 0;
      for(const property in newValue) {
          numOfTuts++;
          if(newValue.hasOwnProperty(property) && newValue[property].isDone()) {
              finishedTuts++;
          }
      }
      this.progress = numOfTuts <= 0 ? 0 : Math.round(100*finishedTuts/numOfTuts);
  }

  _computeTutorialsList (tutorials) {
      const list = [];
      for(const id in tutorials) {
          if(tutorials.hasOwnProperty(id)) {
              list.push({
                  name: tutorials[id].getId(),
                  done: tutorials[id].isDone()
              });
          }
      }
      return list;
  }

  _showProgressContent() {
      this._hiddenContent = false;
  }

  _hideProgressContent() {
      this._hiddenContent = true;
  }

  _isActiveChanged(newValue, oldValue) {
      this._show = newValue;
  }
}
window.customElements.define(AppscoTutorialProgress.is, AppscoTutorialProgress);
