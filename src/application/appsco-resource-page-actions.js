import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoResourcePageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --layout-end-justified;

                --paper-icon-button: {
                     width: 24px;
                     height: 24px;
                     padding: 0;
                     color: var(--primary-text-color);
                 };
                --iron-icon-fill-color: var(--application-action-icon-color);
            }
            :host > * {
                height: 100%;
            }
            appsco-search {
                max-width: 200px;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            .search-subscribers-action {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            .global-page-actions {
                @apply --manage-page-global-actions;
            }
            :host .back-action {
                margin-right: 0;
            }
            :host .info-action {
                margin-left: 10px;
                margin-right: 0;
                display: none;
            }
            :host([tablet-screen]) .info-action {
                display: block;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <template is="dom-if" if="[[ _searchSubscribersActive ]]">
            <div class="search-subscribers-action">

                <appsco-search id="appscoSearch" label="Search subscribers" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>
            </div>
        </template>

        <div class="global-page-actions">
            <paper-icon-button class="back-action" icon="arrow-back" title="Back" on-tap="_backToApplications"></paper-icon-button>

            <paper-icon-button class="info-action" icon="info-outline" title="Resource section" on-tap="_onResourceAction"></paper-icon-button>
        </div>
`;
  }

  static get is() { return 'appsco-resource-page-actions'; }

  static get properties() {
      return {
          _searchSubscribersActive: {
              type: Boolean,
              value: false
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

  ready(){
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

  enableSubscribersSearchAction() {
      this._searchSubscribersActive = true;
  }

  disableSubscribersSearchAction() {
      this._onSearchClear();
      this._searchSubscribersActive = false;
  }

  _backToApplications() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  _onResourceAction() {
      this.dispatchEvent(new CustomEvent('resource-section', { bubbles: true, composed: true }));
  }

  _onSearch(event) {
      this.dispatchEvent(new CustomEvent('search-subscribers', {
          bubbles: true,
          composed: true,
          detail: {
              term: event.detail.term
          }
      }));
  }

  _onSearchClear() {
      this._resetSubscribersSearch();

      this.dispatchEvent(new CustomEvent('search-subscribers-clear', {
          bubbles: true,
          composed: true,
          detail: {
              term: ''
          }
      }));
  }

  _resetSubscribersSearch() {

      if (this._searchSubscribersActive) {
          this.shadowRoot.getElementById('appscoSearch').reset();
      }
  }

  resetApplicationSubscribersPageActions() {
      this._resetSubscribersSearch();
  }
}
window.customElements.define(AppscoResourcePageActions.is, AppscoResourcePageActions);
