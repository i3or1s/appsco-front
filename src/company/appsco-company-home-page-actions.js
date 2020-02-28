import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/page/appsco-page-global.js';
import '../components/components/appsco-search.js';
import '../components/page/appsco-page-config-dropdown.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyHomePageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;

                --application-action-icon-color: var(--app-primary-color);
            }
            :host .actions-container {
                width: 100%;
                padding-left: 10px;
                border-left: 1px solid var(--divider-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-justified;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
            }
            appsco-search {
                max-width: 200px;
            }
            .action-button {
                min-width: 100px;
                @apply --add-item-action;
            }
            :host .new-folder-action {
                @apply --layout-horizontal;
                @apply --layout-center;
                background: none;
                border: none;
                color: var(--primary-text-color);
                font-weight: normal;
                font-size: 14px;
                line-height: 22px;
                margin-top: 4px;
            }
            :host .new-folder-action iron-icon {
                width: 20px;
                height: 20px;
                margin-top: -2px;
                margin-right: 5px;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            :host > * {
                height: 100%;
            }
            :host([mobile-screen]) appsco-page-global {
                margin-left: 10px;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <div class="actions-container">
            <div class="action flex-none">
                <paper-button class="action-button new-folder-action" on-tap="_onAddNewFolderAction">
                    <iron-icon icon="icons:add-circle-outline"></iron-icon>
                    New folder
                </paper-button>
            </div>

            <div class="flex-horizontal">
                <div class="action flex-none">
                    <appsco-search id="appscoSearch" label="Search resources"></appsco-search>
                </div>

                <div class="action flex-none">
                    <paper-icon-button id="configAction" class="config-icon" icon="icons:settings" alt="Page Settings" on-tap="_onShowPageSettings"></paper-icon-button>

                    <appsco-page-config-dropdown id="resourcePageConfigDropdown" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" page-config-api="[[ pageConfigApi ]]" page-config="[[ pageConfig ]]" page="[[ page ]]" option-display-list="" option-sort=""></appsco-page-config-dropdown>
                </div>
            </div>
        </div>

        <appsco-page-global id="appscoPageGlobal" info=""></appsco-page-global>
`;
  }

  static get is() { return 'appsco-company-home-page-actions'; }

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

          pageConfigApi: {
              type: String
          },

          pageConfig: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          page: {
              type: String,
              value: ''
          },

          mobileScreen: {
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
          '_updateScreen(mobileScreen, tabletScreen)'
      ];
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  delay: 200,
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

      beforeNextRender(this, function() {
          if (this.mobileScreen || this.tabletScreen) {
              this.updateStyles();
          }
      });
  }

  resetPage() {
      this.shadowRoot.getElementById('appscoSearch').reset();
  }

  _updateScreen(mobile, tablet) {
      this.updateStyles();
  }

  _onAddNewFolderAction() {
      this.dispatchEvent(new CustomEvent('add-new-folder', { bubbles: true, composed: true }));
  }

  _onShowPageSettings(event) {
      this.shadowRoot.getElementById('resourcePageConfigDropdown').toggle(event.target);
  }
}
window.customElements.define(AppscoCompanyHomePageActions.is, AppscoCompanyHomePageActions);
