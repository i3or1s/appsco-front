import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/page/appsco-page-global.js';
import '../components/application/appsco-application-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoHomePageActions extends mixinBehaviors([ NeonAnimatableBehavior ], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;

                --add-item-action: {
                    @apply --primary-button;
                 };

                --application-action-icon-color: var(--app-primary-color);

                --paper-input-container-color: var(--secondary-text-color);
                --paper-input-container-input-color: var(--primary-text-color);
                --paper-input-container-focus-color: var(--primary-text-color);
                --paper-input-container: {
                     padding: 0;
                 };
                --paper-dropdown-menu: {
                     width: 130px;
                 };
                --applications-actions-paper-dropdown-menu-button: {
                     background-color: var(--body-background-color);
                     border-radius: var(--border-radius-base);
                 };
                --application-actions-paper-dropdown-menu-input: {
                     color: var(--primary-text-color);
                     font-size: 14px;
                     line-height: 1.5;
                 };
                --paper-dropdown-menu-icon: {
                     color: var(--primary-text-color);
                     width: 22px;
                     height: 22px;
                 };
                --paper-icon-button: {
                     width: 24px;
                     height: 24px;
                     padding: 0;
                     color: var(--primary-text-color);
                 };

                --application-actions-tooltip: {
                     top: 34px !important;
                 };
            }
            :host > * {
                height: 100%;
            }
            :host appsco-application-actions {
                @apply --layout-flex;
            }
            :host([tablet-screen]) {

                --input-search-max-width: 22px;

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

                --applications-actions-paper-dropdown-menu-button: {
                     margin-top: 0;
                     background-color: var(--body-background-color);
                     border-radius: var(--border-radius-base);
                 };
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
            :host .actions-container {
                width: 100%;
                padding-left: 10px;
                border-left: 1px solid var(--divider-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-justified;
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
        </div>

        <appsco-application-actions id="appscoApplicationActions" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" page-config-api="[[ pageConfigApi ]]" page-config="[[ pageConfig ]]" page="[[ page ]]" page-config-option-display-list="" page-config-option-sort="" adding-resource-allowed="[[ _isAddingResourceAllowed ]]" on-search-icon="_onSearchIcon" on-close-search="_closeSearch"></appsco-application-actions>

        <appsco-page-global id="appscoPageGlobal" info=""></appsco-page-global>
`;
    }

    static get is() { return 'appsco-home-page-actions'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

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

            _searchActive: {
                type: Boolean,
                value: false
            },

            _isAddingResourceAllowed: {
                type: Boolean,
                computed: '_computeIsAddingResourceAllowed(account)'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers(){
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
        this.$.appscoApplicationActions.focusSearch();

        this.updateStyles({
            '--input-search-max-width': '100%',
            '--paper-input-search-container-tablet': 'width: 100%;'
        });
    }

    _closeSearch() {
        this._searchActive = false;

        // Wait for animation to finish.
        setTimeout(function() {
            this.updateStyles({
                '--input-search-max-width': '22px',
                '--paper-input-search-container-tablet': 'width: auto'
            });
        }.bind(this), 200);

        this.updateStyles();
    }

    _onSearchIcon() {
        this._searchActive = !this._searchActive;
        this._searchActive ? this._showSearch() : this._closeSearch();
    }

    _computeIsAddingResourceAllowed(account) {
        return !(account && account.native_company && !account.native_company.adding_resource_on_personal_allowed);
    }

    resetPage() {
        this.$.appscoApplicationActions.reset();
    }

    resetPageActions() {
        this.$.appscoApplicationActions.reset();
    }

    _onAddNewFolderAction() {
        this.dispatchEvent(new CustomEvent('add-new-folder', {
            bubbles: true,
            composed: true,
            detail: {
                'personal' : true
            }
        }));
    }
}
window.customElements.define(AppscoHomePageActions.is, AppscoHomePageActions);
