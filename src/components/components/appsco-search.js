/*
`appsco-search`

Implements search field used within AppsCo pages.

    <appsco-search label=""
                   float-label
                   filter>
    </appsco-search>

### Styling

`<appsco-search>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-search` | Mixin for the root element | `{}`
`--paper-input-search` | Mixin for the inner paper-input element | `{}`
`--paper-input-prefix` | Mixin for the prefix element in paper-input | `{}`
`--paper-input-prefix-icon` | Mixin for the prefix icon in paper-input | `{}`
`--paper-input-focused-prefix` | Mixin for the prefix element when paper-input is focused | `{}`
`--paper-input-suffix` | Mixin for the suffix element in paper-input | `{}`
`--paper-input-focused-suffix` | Mixin for the suffix element when paper-input is focused | `{}`
`--paper-input-color` | Color for input field - input underline, prefix icon and suffix icon | ``
`--paper-input-focused-color` | Color for focused input field - input underline, prefix icon and suffix icon | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoSearch extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --appsco-search;
            }
            paper-icon-button {
                color: var(--paper-input-color);
                --paper-icon-button-ink-color: var(--paper-input-color);
            }
            paper-input {
                width: 100%;
                line-height: 26px;
                box-sizing: border-box;
                @apply --paper-input-search;

                --paper-input-container: {
                    padding: 0;
                    @apply --appsco-search-input-container;
                };

                --paper-input-container-label: {
                    font-size: 14px;
                    line-height: 20px;
                    bottom: 0;
                    top: initial;
                    @apply --appsco-search-label;
                };

                --paper-input-container-input: {
                    font-size: 14px;
                    line-height: 20px;
                    @apply --appsco-search-input;
                };

                --paper-input-container-underline-focus: {
                    border-bottom: 1px solid var(--paper-input-focused-color);
                };
            }
            div[prefix] {
                height: 20px;
                margin-right: 4px;
                @apply --paper-input-prefix;
                @apply --appsco-search-input-prefix;
            }
            div[prefix] iron-icon {
                width: 18px;
                height: 18px;
                margin: 0;
                @apply --paper-input-prefix-icon;
                @apply --appsco-search-input-prefix-icon;

                --iron-icon-fill-color: var(--paper-input-color);
            }
            paper-input[focused] div[prefix] {
                @apply --paper-input-focused-prefix;
            }
            paper-input[focused] div[prefix] iron-icon {
                fill: var(--paper-input-focused-color);
            }
            paper-icon-button[suffix] {
                width: 20px;
                height: 20px;
                padding: 0;
                margin: 0;
                color: var(--paper-input-color);
                --paper-icon-button-ink-color: var(--paper-input-color);

                @apply --paper-input-suffix;
                @apply --appsco-search-input-suffix;
            }
            paper-input[focused] paper-icon-button[suffix] {
                color: var(--paper-input-focused-color);
                --paper-icon-button-ink-color: var(--paper-input-focused-color);

                @apply --paper-input-focused-suffix;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
        </style>

        <paper-input id="searchInput" label="[[ label ]]" no-label-float="[[ !floatLabel ]]" value="{{ _searchValue }}" tabindex="1" on-focus="_onFocus" on-value-changed="_onValueChanged" on-input="_onSearch">

            <div prefix="" slot="prefix">
                <iron-icon icon="icons:search"></iron-icon>
            </div>

            <template is="dom-if" if="[[ _clearSearch ]]">
                <paper-icon-button id="clear" icon="icons:clear" suffix="" on-tap="_onClearSearch" slot="suffix"></paper-icon-button>
            </template>

        </paper-input>
`;
  }

  static get is() { return 'appsco-search'; }

  static get properties() {
      return {
          label: {
              type: String,
              value: 'Search'
          },

          floatLabel: {
              type: Boolean,
              value: false
          },

          filter: {
              type: Boolean,
              value: false
          },

          _searchValue: {
              type: String,
              value: ''
          },

          _clearSearch: {
              type: Boolean,
              value: false
          },

          _searchDebounce: {
              type: Number,
              value: 0
          }
      };
  }

  _onFocus() {
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  _onValueChanged() {
      this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true }));
  }

  _onSearch(event) {
      const value = this._searchValue,
          length = value.length;

      if (this._searchDebounce > 0) {
          clearTimeout(this._searchDebounce);
      }

      this._searchDebounce = setTimeout(function() {
          this.set('_clearSearch', (length > 0));

          this.dispatchEvent(new CustomEvent('search', {
              bubbles: true,
              composed: true,
              detail: {
                  term: encodeURIComponent(value)
              }
          }));
      }.bind(this), 300);
  }

  _onClearSearch() {
      this.reset();
      this.setup();

      this.dispatchEvent(new CustomEvent('search-clear', { bubbles: true, composed: true }));
  }

  getValue() {
      return this._searchValue;
  }

  setValue(value) {
      if (!value) { value = ''; }
      this._searchValue = value;

      this.set('_clearSearch', (value.length > 0));
  }

  focusAppscoSearchInput() {
      this.$.searchInput.$.input.focus();
  }

  enableAppscoSearchInput() {
      this.$.searchInput.disabled = false;
  }

  disableAppscoSearchInput() {
      this.$.searchInput.disabled = true;
  }

  setup() {
      this.focusAppscoSearchInput();
  }

  reset() {
      this._searchValue = '';
      this._clearSearch = false;
  }
}
window.customElements.define(AppscoSearch.is, AppscoSearch);
