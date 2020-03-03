import '@polymer/polymer/polymer-legacy.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoMenu extends PolymerElement {
    static get template() {
        return html`
        <custom-style>
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                }
                :host span[current-page] {
                    font-size: 16px;
                }
                :host app-drawer {
                    top: var(--app-drawer-top);
                    left: var(--app-drawer-left);
                    right: var(--app-drawer-right);
                    bottom: var(--app-drawer-bottom);
                    z-index: 2;
                    --app-drawer-content-container: {
                        padding: 0;
                        overflow: auto;
                    };
                }
                :host span[text] {
                    padding-left: 10px;
                }
                :host paper-menu {
                    padding:0;
                }
                :host paper-item {
                    cursor: pointer;
                }
            </style>
        </custom-style>

        <paper-icon-button id="menuicon" icon="icons:menu" on-tap="_toggleDrawer"></paper-icon-button>
        <span current-page="">[[ _page ]]</span>
        <app-drawer id="menudrawer">
            <paper-menu selected="0">
                <paper-item page="applications">
                    <iron-icon icon="icons:apps"></iron-icon>
                    <span text="">Applications</span>
                </paper-item>
                <paper-item page="account">
                    <iron-icon icon="icons:perm-identity"></iron-icon>
                    <span text="">Account</span>
                </paper-item>
                <template is="dom-if" if="[[ administration ]]">
                    <hr>
                    <paper-item page="manage-applications">
                        <iron-icon icon="icons:apps"></iron-icon>
                        <span text="">Manage Applications</span>
                    </paper-item>
                    <paper-item page="manage-accounts">
                        <iron-icon icon="icons:supervisor-account"></iron-icon>
                        <span text="">Manage Accounts</span>
                    </paper-item>
                    <paper-item page="billing">
                        <iron-icon icon="icons:payment"></iron-icon>
                        <span text="">Billing</span>
                    </paper-item>
                    <paper-item page="directory-integrations">
                        <iron-icon icon="icons:cloud-queue"></iron-icon>
                        <span text="">Directory Integrations</span>
                    </paper-item>
                    <paper-item page="settings">
                        <iron-icon icon="icons:settings"></iron-icon>
                        <span text="">Settings</span>
                    </paper-item>
                    <paper-item page="reports">
                        <iron-icon icon="icons:assignment"></iron-icon>
                        <span text="">Reports</span>
                    </paper-item>
                    <paper-item page="statistics">
                        <iron-icon icon="icons:assessment"></iron-icon>
                        <span text="">Statistics</span>
                    </paper-item>
                </template>
            </paper-menu>
        </app-drawer>
`;
    }

    static get is() { return 'appsco-menu'; }

    static get properties() {
        return {
            topOffset: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * Right offset from the right side of the screen.
             */
            rightOffset: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * Bottom offset from the bottom side of the screen.
             */
            bottomOffset: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * It shows administration menu
             */
            administration: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Current page
             */
            _page: {
                type: String,
                value: 'Applications'
            }
        };
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this._updateDrawer();
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('right-offset-changed', this._updateDrawer);
        this.addEventListener('bottom-offset-changed', this._updateDrawer);
        this.addEventListener('top-offset-changed', this._updateDrawer);
        this.addEventListener('iron-select', this._updateDrawer);
    }

    _updateDrawer() {
        const menuPosition = this.$.menuicon.getBoundingClientRect();
        this.updateStyles({
            '--app-drawer-top': menuPosition.top + 40 + this.topOffset + 'px',
            '--app-drawer-left': menuPosition.left + 'px',
            '--app-drawer-right': this.rightOffset + 'px',
            '--app-drawer-bottom': this.bottomOffset + 'px'
        });
    }

    _toggleDrawer() {
        this.$.menudrawer.toggle();
    }

    _pageChanged(e) {
        const page = e.detail.item.getAttribute('page');
        this._page = e.detail.item.querySelector('span').innerHTML;
        this.$.menudrawer.close();

        this.dispatchEvent(new CustomEvent('page-changed', {
            bubbles: true,
            composed: true,
            detail: {
                page: page
            }
        }));
    }
}
window.customElements.define(AppscoMenu.is, AppscoMenu);
