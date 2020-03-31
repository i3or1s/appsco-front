import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/application/appsco-application-subscribers.js';
import './application/appsco-application-components-page.js';
import './application/appsco-application-settings-page.js';
import './application/appsco-application-subscribers-page.js';
import './application/appsco-application-log-page.js';
import './application/appsco-resource-image-settings.js';
import './components/account/appsco-account-image.js';
import './application/appsco-resource-page-actions.js';
import './components/application/appsco-application-share.js';
import './components/application/appsco-application-subscriber-revoke.js';
import './components/application/appsco-application-remove.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoResourcePage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                display: block;
                color: #000;

                --appsco-content-sections: {
                     padding: 0;
                 };

                --resource-width: 300px;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            :host div[resource] {
                padding: 10px;
                height: calc(100% - 32px - 20px - 10px);
                overflow: auto;
            }
            :host div[content] {
                height: 100%;
            }
            :host .application-components, :host .application-components neon-animated-pages {
                height: 100%;
            }
            appsco-application-components-page {
                padding: 10px;
            }
            :host .resource-header {
                padding: 20px 10px 40px;
                border-bottom: 1px solid var(--divider-color);
                position: relative;
            }
            :host .resource-header .action-share {
                color: var(--app-secondary-color);
                position: absolute;
                top: 0;
                right: 0;
            }
            appsco-account-image {
                position: absolute;
                bottom: -22px;
                left: 10px;
                box-sizing: border-box;

                --account-initials-background-color: var(--body-background-color-darker);
                --account-image: {
                    width: 42px;
                    height: 42px;
                    border: 4px solid var(--body-background-color);
                };
            }
            :host .application-title {
                margin-top: 30px;
                margin-bottom: 0;
            }
            .appsco-application-subscribers {
                margin-top: 10px;
            }
            :host div[resource] .resource-actions {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
            :host .open-button, :host .remove-button {
                @apply --primary-button;
                border-radius: 0;
            }
            :host .open-button {
                margin-right: 1px;
            }
            :host .remove-button {
                @apply --danger-button;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
            }
            :host .flex {
                @apply --layout-flex;
            }
            :host([medium-screen]) {
                --resource-width: 240px;
            }
            :host([mobile-screen]) {
                --resource-width: 180px;
            }
            :host .application-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto;
                display: block;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <paper-icon-button class="action-share" icon="social:share" title="Share" on-tap="_onShareApplication"></paper-icon-button>

                    <appsco-resource-image-settings resource="{{ application.application }}" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ _resourceImageSettingsApi ]]"></appsco-resource-image-settings>


                    <appsco-account-image account="[[ account ]]"></appsco-account-image>
                </div>

                <p class="application-title">[[ application.title ]]</p>

                <appsco-application-subscribers class="appsco-application-subscribers" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" size="5" preview="">
                </appsco-application-subscribers>

                <div class="resource-actions flex-horizontal">
                    <paper-button class="open-button flex" on-tap="_onOpenApplication">
                        Open
                    </paper-button>

                    <paper-button class="remove-button flex" on-tap="_onRemoveApplication">
                        remove
                    </paper-button>
                </div>

            </div>

            <div content="" slot="content">

                <div class="application-components">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

                        <appsco-application-components-page id="appscoApplicationComponentsPage" name="appsco-application-components-page" application="{{ application }}" authorization-token="[[ authorizationToken ]]" on-application-settings="_onApplicationSettings" on-all-subscribers="_onAllSubscribers" on-all-log="_onAllLog" on-log-loaded="_pageLoaded" on-log-empty="_pageLoaded">
                        </appsco-application-components-page>

                        <appsco-application-settings-page id="appscoApplicationSettingsPage" name="appsco-application-settings-page" application="{{ application }}" authorization-token="[[ authorizationToken ]]" on-application-settings-saved="_onApplicationSettingsSaved" on-back="_onApplicationSettingsBack">
                        </appsco-application-settings-page>

                        <appsco-application-subscribers-page id="appscoApplicationSubscribersPage" name="appsco-application-subscribers-page" application="{{ application }}" authorization-token="[[ authorizationToken ]]" account="[[ account ]]" on-subscription-revoke="_onSubscriptionRevoke" on-enable-subscribers-search-action="_onEnableSubscribersSearchAction" on-disable-subscribers-search-action="_onDisableSubscribersSearchAction" on-back="_onResourceBack" on-subscribers-loaded="_pageLoaded"></appsco-application-subscribers-page>

                        <appsco-application-log-page id="appscoApplicationLogPage" name="appsco-application-log-page" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" company="[[ company ]]" on-back="_onResourceBack">
                        </appsco-application-log-page>

                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <iron-ajax id="ironAjaxGetApplication" url="[[ applicationsApi ]]" on-error="_onApplicationError" on-response="_onApplicationResponse" headers="[[ _headers ]]">
        </iron-ajax>

        <appsco-application-share id="appscoApplicationShare" authorization-token="[[ authorizationToken ]]" accounts-api="[[ accountsApi ]]">
        </appsco-application-share>

        <appsco-application-remove id="appscoApplicationRemove" authorization-token="[[ authorizationToken ]]">
        </appsco-application-remove>

        <appsco-application-subscriber-revoke id="appscoApplicationSubscriberRevoke" authorization-token="[[ authorizationToken ]]">
        </appsco-application-subscriber-revoke>
`;
    }

    static get is() { return 'appsco-resource-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            iconsApi: {
                type: String
            },

            company: {
                type: Boolean,
                value: false
            },

            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
            _selected: {
                type: String,
                value: 'appsco-application-components-page',
                notify: true
            },

            accountsApi: {
                type: String
            },

            applicationsApi: {
                type: String,
                notify: true,
                observer: '_onApplicationsApiChanged'
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _subscribers: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _resourceImageSettingsApi: {
                type: String,
                computed: '_computeResourceImageSettingsApi(application)'
            },

            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mediumScreen, tabletScreen, mobileScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
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
            if (this.mobileScreen || this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._getApplication();
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
        this.toolbar.addEventListener('search-subscribers', this._onSearchSubscribers.bind(this));
        this.toolbar.addEventListener('search-subscribers-clear', this._onSearchSubscribersClear.bind(this));
    }

    _onApplicationsApiChanged() {
        this._getApplication();
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if(!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _computeResourceImageSettingsApi(resource) {
        return resource.application && resource.application.meta ? resource.application.meta.change_application_image : null;
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _getApplication() {
        if (!this.application.self && this.applicationsApi && this._headers) {
            this.$.ironAjaxGetApplication.url = this.iconsApi + this.route.path;
            this.$.ironAjaxGetApplication.generateRequest();
        }

    }

    _onApplicationResponse(event) {
        const icon = event.detail.response.icon;

        if (icon.owner) {
            this.application = event.detail.response.icon;
        }
        else {
            this._onApplicationError();
        }
    }

    _onApplicationError() {
        this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
    }

    _onApplicationSettings() {
        this._selected = 'appsco-application-settings-page';
    }

    _onAllSubscribers() {
        this._selected = 'appsco-application-subscribers-page';
    }

    _onAllLog() {
        this._selected = 'appsco-application-log-page';
    }

    _onApplicationSettingsSaved() {
        this._showApplicationComponentsPage();
    }

    _onApplicationSettingsBack() {
        this.$.appscoApplicationSettingsPage.resetPage();
        this._showApplicationComponentsPage();
    }

    _onResourceBack() {
        this._showApplicationComponentsPage();
    }

    _showApplicationComponentsPage() {
        this._selected = 'appsco-application-components-page';
    }

    _onShareApplication() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationShare');
        dialog.setApplication(this.application);
        dialog.toggle();
    }

    _onOpenApplication() {
        window.open(this.application.meta.plugin_go, '_blank');
    }

    resetPage() {
        this._showApplicationComponentsPage();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    searchSubscribers(term) {
        this.$.appscoApplicationSubscribersPage.searchSubscribers(term);
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        if('appsco-application-subscribers-page' === fromPage.getAttribute('name')) {
            fromPage.resetPage();
        }

        switch(toPage.getAttribute('name')) {
            case 'appsco-application-settings-page':
                toPage.setPage();
                break;
            case 'appsco-application-subscribers-page':
                toPage.setupPage();
                break;
            default:
                break;
        }
    }

    _searchSubscribers(term) {
        this._showProgressBar();
        this.searchSubscribers(term);
    }

    _onSearchSubscribers(event) {
        this._searchSubscribers(event.detail.term);
    }

    _onSearchSubscribersClear() {
        this._searchSubscribers('');
    }

    _onRemoveApplication() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationRemove');
        dialog.setApplication(this.application);
        dialog.open();
    }

    _onSubscriptionRevoke(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationSubscriberRevoke');
        dialog.application =   event.detail.application;
        dialog.revokeAccount = event.detail.account;

        dialog.open();
    }

    _onEnableSubscribersSearchAction() {
        this.toolbar.enableSubscribersSearchAction();
    }

    _onDisableSubscribersSearchAction() {
        this.toolbar.disableSubscribersSearchAction();
    }
}
window.customElements.define(AppscoResourcePage.is, AppscoResourcePage);
