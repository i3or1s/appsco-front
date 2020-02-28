import '@polymer/polymer/polymer-legacy.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../page/appsco-page-global.js';
import './appsco-group-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
class AppscoGroupsPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            :host > * {
                height: 100%;
            }
            appsco-group-actions {
                @apply --layout-flex;

                --add-item-action: {
                    @apply --primary-button;
                };
            }
            appsco-page-global {
                padding-left: 10px;
                margin-left: 16px;
            }
            :host([tablet-screen]) {

                --appsco-group-actions: {
                     width: 100%;
                 };
            }
            :host([mobile-screen]) appsco-page-global {
                margin-left: 10px;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-group-actions id="appscoGroupsActions" authorization-token="[[ authorizationToken ]]" company="" on-search-icon="_onSearchIcon" on-close-search="_closeSearch"></appsco-group-actions>

        <appsco-page-global id="appscoPageGlobal" info=""></appsco-page-global>
`;
  }

  static get is() { return 'appsco-groups-page-actions'; }

  static get properties() {
      return {
          authorizationToken: {
              type: String
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

          _searchActive: {
              type: Boolean,
              value: false
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

  _updateScreen(mobile, tablet) {
      this.updateStyles();
  }

  _showSearch() {
      this.$.appscoGroupsActions.focusSearch();

      this.updateStyles({
          '--input-search-max-width': '100%',
          '--paper-input-search-container-tablet': 'width: 100%;'
      });
  }

  _closeSearch() {
      this._searchActive = false;

      this.updateStyles({'--input-search-max-width': '22px'});

      // Wait for animation to finish.
      setTimeout(function() {
          this.updateStyles({'--paper-input-search-container-tablet': 'width: auto'});
      }.bind(this), 200);

      this.updateStyles();
  }

  _onSearchIcon() {
      this._searchActive = !this._searchActive;
      this._searchActive ? this._showSearch() : this._closeSearch();
  }

  showBulkActions() {
      this.shadowRoot.getElementById('appscoGroupsActions').showBulkActions();
  }

  hideBulkActions() {
      this.shadowRoot.getElementById('appscoGroupsActions').hideBulkActions();
  }

  showBulkSelectAll() {
      this.shadowRoot.getElementById('appscoGroupsActions').showBulkSelectAll();
  }

  hideBulkSelectAll() {
      this.shadowRoot.getElementById('appscoGroupsActions').hideBulkSelectAll();
  }

  resetPage() {
      this.$.appscoGroupsActions.reset();
  }

  resetPageActions() {
      this.resetPage();
  }
}
window.customElements.define(AppscoGroupsPageActions.is, AppscoGroupsPageActions);
