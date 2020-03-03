import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class Appsco404Page extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                padding: 10px 20px;
                color: var(--secondary-text-color);
            }
            :host .background-circle {
                width: calc(100vh / 1.7);
                height: calc(100vh / 1.7);
                background-color: #E6EBEF;
                border: calc(100vh / 16) solid #EDF1F4;
                border-radius: 50%;
                color: #546E7A;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .info {
                width: 100vw;
                height: calc(100vh / 1.7);
                @apply --layout-vertical;
                @apply --layout-center;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
            }
            :host .lead-title {
                font-size: calc(100vh / 5);
                font-weight: 600;
                line-height: calc(100vh / 5);
                margin-top: calc(100vh / 10);
            }
            :host .lead-info {
                text-align: center;
                font-size: calc(100vh / 22);
                font-weight: 500;
            }
            :host .back-to-home {
                margin-top: 20px;
            }
            :host paper-button {
                @apply --primary-button;
                text-align: center;
                font-size: calc(100vh / 58);
            }
            :host([tablet-screen]) .background-circle {
                width: calc(100vw / 1.4);
                height: calc(100vw / 1.4);
                border-width: calc(100vh / 20);
            }
            :host([tablet-screen]) .info {
                width: 96vw;
                height: calc(100vh / 1.4);
            }
            :host([tablet-screen]) .lead-title {
                font-size: calc(100vh / 8);
                line-height: calc(100vh / 7);
                margin-top: calc(100vh / 5);
            }
            :host([tablet-screen]) .lead-info {
                font-size: calc(100vh / 26);
            }
            :host([tablet-screen]) .back-to-home {
                margin-top: 10px;
            }
        </style>

        <iron-media-query query="(max-width: 992px)" query-matches="{{ tabletScreen }}"></iron-media-query>


        <div class="background-circle"></div>

        <div class="info">
            <div class="lead-title">404</div>
            <div class="lead-info">The page you requested does not exist.</div>

            <paper-button class="back-to-home" on-tap="_onBackToHomeAction">Back to home</paper-button>
        </div>
`;
    }

    static get is() { return 'appsco-not-found-page'; }

    static get properties() {
        return {
            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(tabletScreen)'
        ];
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            if (this.tabletScreen) {
                this.updateStyles();
            }
        });
    }

    _updateScreen(tablet) {
        this.updateStyles();
    }

    _onBackToHomeAction() {
        this.dispatchEvent(new CustomEvent('back-to-home-page', { bubbles: true, composed: true }));
    }
}
window.customElements.define(Appsco404Page.is, Appsco404Page);
