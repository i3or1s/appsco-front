import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoBrand extends PolymerElement {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: inline-block;

                @apply --appsco-brand;
            }
            .brand {
                cursor: pointer;
            }
            .brandNotClickable {
                cursor: default !important;
            }
            .logo {
                float: left;
                @apply --appsco-brand-logo;
            }
            .title {
                margin-left: 10px;
            }
            .brand-info {
                @apply --appsco-brand-info;
            }
            :host[mobile] .title {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobile }}"></iron-media-query>

        <div class="layout vertical">

            <div id="brand" class="brand" on-tap="_onBrandAction">
                <img src="[[ logo ]]" alt="[[ title ]]" width\$="[[ logoWidth ]]" height\$="[[ logoHeight ]]" class="logo">
                <span id="title" class="title" hidden\$="[[ !_brandTitle ]]">[[ brandTitle ]]</span>
            </div>

            <div class="brand-info">
                <slot name="brand-info"></slot>
            </div>

        </div>
`;
    }

    static get is() { return 'appsco-brand'; }

    static get properties() {
        return {
            mobile: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /** Source to image which represents brand logo. */
            logo: {
                type: String,
                value: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMjhweCIgaGVpZ2h0PSIyOHB4IiB2aWV3Qm94PSIwIDAgMjggMjgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+QXBwc0NvLWxvZ288L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJBcHBzQ28tbG9nbyI+ICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIj4gICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yIiBmaWxsPSIjMjA5QkMzIiB4PSIwIiB5PSIxNSIgd2lkdGg9IjEzIiBoZWlnaHQ9IjEzIj48L3JlY3Q+ICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMi1Db3B5IiBmaWxsPSIjODhCOTU1IiB4PSIxNSIgeT0iMCIgd2lkdGg9IjEzIiBoZWlnaHQ9IjEzIj48L3JlY3Q+ICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMi1Db3B5LTIiIGZpbGw9IiNFNkQwMjUiIHg9IjE1IiB5PSIxNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+ICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMi1Db3B5LTMiIGZpbGw9IiNEODNEODIiIHg9IjMiIHk9IjMiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=='
            },

            /** Width of brand logo. */
            logoWidth: {
                type: Number,
                value: 32
            },

            /** Height of brand logo. */
            logoHeight: {
                type: Number,
                value: 32
            },

            /** Title of a brand to be displayed right to brand logo. */
            brandTitle: {
                type: String,
                value: ''
            },

            _brandTitle: {
                type: Boolean,
                computed: '_computeBrandTitle(brandTitle)',
                observer: '_onBrandTitleChanged'
            },

            brandLogoClickable: {
                type: Boolean,
                value: false,
                observer: '_onBrandLogoClickable'
            }
        };
    }

    _onBrandLogoClickable(clickable) {
        if(clickable) {
            this.$.brand.classList.remove('brandNotClickable');
        } else {
            this.$.brand.classList.add('brandNotClickable');
        }
    }

    _computeBrandTitle(title) {
        return title && title.length > 0;
    }

    _onBrandTitleChanged(title) {
        if (title) {
            this._setStyle();
        }
    }

    /**
     * Applies style to `element`.
     * It calculates brandTitle font-size and line-height depending on logoSize value.
     */
    _setStyle() {
        const size = this.logoHeight,
            title = this.shadowRoot.getElementById('title');

        if (title && size && size != 0 && size != '') {
            title.style.fontSize = (size / 1.6) + 'px';
            title.style.lineHeight = size + 'px';
        }
    }

    _onBrandAction() {
        this.dispatchEvent(new CustomEvent('brand-action', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoBrand.is, AppscoBrand);
