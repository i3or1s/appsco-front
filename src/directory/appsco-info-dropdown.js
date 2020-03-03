import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-card/paper-card.js';
import '../components/header/appsco-dropdown.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoInfoDropdown extends PolymerElement {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: inline-block;
                position: relative;
                color: var(--primary-text-color, #414042);

                --paper-card-content: {
                    @apply --layout-flex-vertical;
                    padding: 10px;
                    font-size: 14px;
                };
                --paper-card-actions: {
                    padding: 0;
                    border-color: #ffffff;
                    font-size: 12px;
                };
            }
            appsco-dropdown {
                top: 12px;
                right: 0;
                @apply --appsco-info-dropdown;

                --dropdown-caret-background-color: var(--paper-orange-300);
            }
            :host paper-card {
                @apply --layout-flex-vertical;
                width: 100%;
                background-color: var(--paper-orange-300);
                color: #ffffff;
            }
            :host .dropdown-action {
                width: 100%;
                padding: 6px 0;
                margin: 0;
                border-radius: 0;
                background-color: transparent;
                font-size: 12px;
                border: none;
            }
        </style>

        <appsco-dropdown id="dropdown" trigger="[[ _triggerDropdown ]]">

            <paper-card class="layout vertical">

                <div class="card-content">

                    <slot name="content" old-content-selector="[content]"></slot>

                </div>

                <template is="dom-if" if="[[ actionLabel ]]">
                    <div id="dropdownActions" class="card-actions">
                        <paper-button class="dropdown-action" on-tap="_onDropdownAction">[[ actionLabel ]]</paper-button>
                    </div>
                </template>

            </paper-card>

        </appsco-dropdown>
`;
    }

    static get is() { return 'appsco-info-dropdown'; }

    static get properties() {
        return {
            actionLabel: {
                type: String,
                value: ''
            },

            /**
             * DOM element which triggers the dropdown.
             */
            _triggerDropdown: {
                type: Object,
                notify: true
            }
        };
    }

    ready() {
        super.ready();

        this._triggerDropdown = this.shadowRoot.getElementById('dropdownActions');
    }

    toggle(target) {
        this._triggerDropdown = target;
        this.$.dropdown.toggle();
    }

    _onDropdownAction() {
        this.dispatchEvent(new CustomEvent('info-action', { bubbles: true, composed: true }));
        this.toggle();
    }
}
window.customElements.define(AppscoInfoDropdown.is, AppscoInfoDropdown);
