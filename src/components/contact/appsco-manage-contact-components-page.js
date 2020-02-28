import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './appsco-contact-applications.js';
import './appsco-contact-groups.js';
import '../account/appsco-account-log.js';
import '../page/appsco-layout-with-cards-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoManageContactComponentsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-layout-with-cards-styles">
            :host {
                --iron-icon-height: 20px;
                --iron-icon-width: 20px;
                --iron-icon: {
                     margin-top: -3px;
                 };
            }
            appsco-account-log {
                --appsco-account-log-item: {
                     padding: 16px 6px 8px 6px;
                 };
                --appsco-account-log-item-first: {
                     border-top: none;
                 };
                --log-item-date: {
                     top: 2px;
                 };
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="cols-layout two-cols-layout">
            <div class="col">
                <paper-card heading="Shared resources">
                    <div class="card-content">
                        <appsco-contact-applications id="contactApplications" contact="[[ contact ]]" authorization-token="[[ authorizationToken ]]" size="5" preview=""></appsco-contact-applications>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onAllApplications">ALL</paper-button>
                    </div>
                </paper-card>

                <div class="groups">
                    <paper-card heading="Groups" class="appsco-contact-groups">
                        <div class="card-content">
                            <appsco-contact-groups id="appscoContactGroup" authorization-token="[[ authorizationToken ]]" groups-api="[[ groupsApi ]]" contact="[[ contact ]]" size="5" preview=""></appsco-contact-groups>
                        </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onManageGroups">Manage</paper-button>
                        </div>
                    </paper-card>
                </div>
            </div>

            <div class="col">
                <paper-card heading="Activity log">
                    <div class="card-content">

                        <appsco-account-log id="appscoAccountLog" account="[[ contact.account ]]" authorization-token="[[ authorizationToken ]]" log-api="[[ logApi ]]" size="5" short-view="">
                        </appsco-account-log>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageActivityLog">ALL</paper-button>
                    </div>
                </paper-card>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-manage-contact-components-page'; }

  static get properties() {
      return {
          contact: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          administrator: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String
          },

          logApi: {
              type: String,
              observer: '_onLogApiChanged'
          },

          groupsApi: {
              type: String
          },

          mediumScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          tabletScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          animationConfig: {
              type: Object
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(tabletScreen, mediumScreen)'
      ];
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': [{
              name: 'cascaded-animation',
              animation: 'fade-in-animation',
              nodes: dom(this.root).querySelectorAll('paper-card'),
              nodeDelay: 50,
              timing: {
                  delay: 200,
                  duration: 100
              }
          }],
          'exit': [{
              name: 'hero-animation',
              id: 'hero',
              fromPage: this
          }, {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 500
              }
          }]
      };

      beforeNextRender(this, function() {
          if (this.tabletScreen || this.mediumScreen) {
              this.updateStyles();
          }
      });
  }

  loadLog() {
      this.$.appscoAccountLog.loadLog();
  }

  _onLogApiChanged(logApi) {
      if (logApi) {
          this.loadLog();
      }
  }

  load() {
      this._loadGroups();
  }

  _loadGroups() {
      this.$.appscoContactGroup.loadGroups();
  }

  _updateScreen(tablet, medium) {
      this.updateStyles();
  }

  _setSharedElement(target) {
      while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
          target = target.parentNode;
      }

      this.sharedElements = {
          'hero': target
      };
  }

  _onAllApplications(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-applications', { bubbles: true, composed: true }));
  }

  _onManageActivityLog(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-activity-log', { bubbles: true, composed: true }));
  }

  _onManageGroups(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-groups', { bubbles: true, composed: true }));
  }

  reloadApplications() {
      this.$.contactApplications.reload();
  }
}
window.customElements.define(AppscoManageContactComponentsPage.is, AppscoManageContactComponentsPage);
