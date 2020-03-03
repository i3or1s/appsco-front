import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/av-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPageGlobal extends PolymerElement {
    static get template() {
        return html`
        <custom-style>
            <style>
                :host {
                    display: inline-block;
                    @apply --layout-horizontal;
                    @apply --layout-center;
                    @apply --layout-end-justified;

                    --paper-icon-button-ink-color: var(--appsco-page-global-action-color);

                    @apply --appsco-page-global;
                }
                :host *[hidden] {
                    display: none;
                }
                :host .action {
                    position: relative;
                    @apply --layout-vertical;
                    @apply --layout-center;
                    @apply --global-action;
                }
                :host paper-icon-button {
                    color: var(--appsco-page-global-action-color);
                }
                :host paper-icon-button[active] {
                    @apply --appsco-icon-active;
                }
                :host .expand-icon {
                    width: 32px;
                    height: 32px;
                    transition: transform 0.2s linear;
                }
                :host .expand-icon[active] {
                    transform: rotate(180deg);
                    transition: transform 0.3s linear;
                }
                :host paper-icon-button::shadow paper-ripple {
                    width: 150%;
                    height: 150%;
                    top: -25%;
                    left: -25%;
                }
                .flex-none {
                    @apply --layout-flex-none;
                }
            </style>
        </custom-style>

        <template is="dom-if" if="[[ additionalOptions ]]">
            <div class="action flex-none">
                <paper-icon-button icon="icons:expand-more" class="expand-icon" on-tap="_onAdditionalOptionsAction" toggles=""></paper-icon-button>
            </div>
        </template>

        <template is="dom-if" if="[[ filters ]]">
            <div class="action flex-none">
                <paper-icon-button icon="icons:filter-list" on-tap="_onFilters" toggles=""></paper-icon-button>
            </div>
        </template>

        <template is="dom-if" if="[[ info ]]">
            <div class="action flex-none">
                <paper-icon-button icon="icons:info-outline" on-tap="_info" toggles=""></paper-icon-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-page-global'; }

    static get properties() {
        return {
            /**
             * Show info icon
             *
             * @type Boolean
             */
            info: {
                type: Boolean,
                value: false
            },

            /**
             * Show help icon
             *
             * @type Boolean
             */
            help: {
                type: Boolean,
                value: false
            },

            /**
             * Show settings icon
             *
             * @type Boolean
             */
            settings: {
                type: Boolean,
                value: false
            },

            /**
             * Show sort icon
             *
             * @type Boolean
             */
            sort: {
                type: Boolean,
                value: false
            },

            /**
             * Show filters action
             *
             * @type Boolean
             */
            filters: {
                type: Boolean,
                value: false
            },

            additionalOptions: {
                type: Boolean,
                value: false
            }
        };
    }

    _info(e) {
        this.dispatchEvent(new CustomEvent('page-global-info', {
            bubbles: true,
            composed: true,
            detail: {
                active: e.currentTarget.active
            }
        }));
    }

    _settings(e) {
        this.dispatchEvent(new CustomEvent('page-global-settings', {
            bubbles: true,
            composed: true,
            detail: {
                active: e.currentTarget.active
            }
        }));
    }

    _sort(e) {
        this.dispatchEvent(new CustomEvent('page-global-sort', {
            bubbles: true,
            composed: true,
            detail: {
                active: e.currentTarget.active
            }
        }));
    }

    _help(e) {
        this.dispatchEvent(new CustomEvent('page-global-help', {
            bubbles: true,
            composed: true,
            detail: {
                active: e.currentTarget.active
            }
        }));
    }

    _onFilters() {
        this.dispatchEvent(new CustomEvent('page-global-filters', { bubbles: true, composed: true }));
    }

    _onAdditionalOptionsAction() {
        this.dispatchEvent(new CustomEvent('page-global-toggle-additional-options', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoPageGlobal.is, AppscoPageGlobal);
