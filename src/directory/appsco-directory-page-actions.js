import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/page/appsco-page-global.js';
import './appsco-directory-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoDirectoryPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                --add-item-action: {
                    @apply --primary-button;
                };

                --paper-input-container-color: var(--secondary-text-color);
                --paper-input-container-input-color: var(--primary-text-color);
                --paper-input-container-focus-color: var(--primary-text-color);
                --paper-input-container: {
                    padding: 0;
                };
                --paper-input-container-input: {
                    font-size: 14px;
                };
                --paper-input-container-label: {
                    font-size: 14px;
                    bottom: 0;
                    top: initial;
                };
                --paper-input-container-label-focus: {
                    left: 30px;
                };
                --paper-input-prefix: {
                    height: 20px;
                    margin-right: 4px;
                    color: var(--secondary-text-color);
                };

                --paper-dropdown-menu: {
                    width: 130px;
                };
                --accounts-actions-paper-dropdown-menu-button: {
                    background-color: var(--body-background-color);
                    border-radius: var(--border-radius-base);
                };
                --accounts-actions-paper-dropdown-menu-input: {
                    color: var(--primary-text-color);
                    font-size: 14px;
                    line-height: 1.5;
                };
                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };
                --paper-listbox: {
                    padding: 0;
                };
                --paper-item: {
                    cursor: pointer;
                    color: var(--secondary-text-color);
                };
                --paper-item-selected-weight: normal;
                --paper-item-selected: {
                    color: var(--primary-text-color);
                    background-color: transparent;
                };

                --application-actions-tooltip: {
                    top: 34px !important;
                };

                --info-icon-color: var(--paper-orange-300);
            }
            :host .page-actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                height: 100%;
            }
            :host .page-actions * {
                height: 100%;
            }
            :host .page-actions[hidden] {
                display: none;
            }
            :host appsco-directory-actions {
                @apply --layout-flex;
            }
            :host([tablet-screen]) {
                --add-item-action: {
                    display: none;
                };
                --import-item-action: {
                    display: none;
                };
                --add-item-icon-button: {
                    display: block;
                };

                --input-search-max-width: 150px;

                --appsco-application-actions: {
                    width: 100%;
                };
                --paper-input-search-container: {
                    height: 38px;
                    background-color: #ffffff;
                    position: absolute;
                    left: 0;
                    z-index: 10;
                    @apply --paper-input-search-container-tablet;
                };

                --paper-input-search: {
                    transition: all 0.2s ease-in;
                    max-width: var(--input-search-max-width);
                };
                --paper-dropdown-menu: {
                    display: none;
                };

                --input-search-prefix: {
                    cursor: pointer;
                };
            }
            :host([mobile-screen]) appsco-page-global {
                margin-left: 10px;
            }
            :host([mobile-screen]) {
                --add-item-action: {
                    display: none;
                };
                --add-item-icon-button: {
                    display: block;
                };
                --import-item-action: {
                    display: none;
                };
                --import-item-icon-button: {
                    display: block;
                };
                --paper-input-search: {
                    display: none;
                };
                --paper-dropdown-menu: {
                    display: none;
                };

                --applications-actions-paper-dropdown-menu-button: {
                    margin-top: 0;
                    background-color: var(--body-background-color);
                    border-radius: var(--border-radius-base);
                };
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <div class="page-actions" hidden\$="[[ !_displayActions ]]">
            <appsco-directory-actions id="appscoDirectoryActions" authorization-token="[[ authorizationToken ]]" filter-api="[[ filterApi ]]" business="" on-search-icon="_onSearchIcon" on-close-search="_closeSearch"></appsco-directory-actions>

            <appsco-page-global id="appscoPageGlobal" info="" filters=""></appsco-page-global>
        </div>
`;
  }

  static get is() { return 'appsco-directory-page-actions'; }

  static get properties() {
      return {
          authorizationToken: {
              type: String
          },

          filterApi: {
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

          _displayActions: {
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
      this.shadowRoot.getElementById('appscoDirectoryActions').focusSearch();
      this.updateStyles({'--paper-input-search-container-tablet': 'width: 100%;'});
  }

  _closeSearch() {
      this._searchActive = false;

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
      this.shadowRoot.getElementById('appscoDirectoryActions').showBulkActions();
  }

  hideBulkActions() {
      this.shadowRoot.getElementById('appscoDirectoryActions').hideBulkActions();
  }

  showBulkSelectAll() {
      this.shadowRoot.getElementById('appscoDirectoryActions').showBulkSelectAll();
  }

  hideBulkSelectAll() {
      this.shadowRoot.getElementById('appscoDirectoryActions').hideBulkSelectAll();
  }

  showSubscriptionLimitReachedInfo(subscription) {
      this.shadowRoot.getElementById('appscoDirectoryActions').showSubscriptionLimitReachedInfo(subscription);
      this._showActions();
  }

  hideSubscriptionLimitReachedInfo() {
      this.shadowRoot.getElementById('appscoDirectoryActions').hideSubscriptionLimitReachedInfo();
      this._showActions();
  }

  showDomainNotVerifiedInfo() {
      this.shadowRoot.getElementById('appscoDirectoryActions').showDomainNotVerifiedInfo();
      this._showActions();
  }

  hideDomainNotVerifiedInfo() {
      this.shadowRoot.getElementById('appscoDirectoryActions').hideDomainNotVerifiedInfo();
      this._showActions();
  }

  _showActions() {
      this._displayActions = true;
  }

  setupPage() {
      this._showActions();
  }

  resetPage() {
      this.shadowRoot.getElementById('appscoDirectoryActions').reset();
  }

  resetPageActions() {
      this.resetPage();
  }

  resetTypeFilter() {
      this.shadowRoot.getElementById('appscoDirectoryActions').resetTypeFilter();
  }
}
window.customElements.define(AppscoDirectoryPageActions.is, AppscoDirectoryPageActions);
