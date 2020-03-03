import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/oauth-application/appsco-oauth-applications.js';
import './components/oauth-application/appsco-oauth-application-info.js';
import './components/components/appsco-page-behavior.js';
import './components/oauth-application/appsco-oauth-applications-page-actions.js';
import './components/oauth-application/appsco-add-oauth-application.js';
import './components/oauth-application/appsco-remove-oauth-application.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOauthApplicationsPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {

                --details-label: {
                    font-size: 12px;
                };
                --details-value: {
                    font-size: 14px;
                };
            }
            :host div[resource] > .resource-content {
                padding-top: 20px;
            }
            .application-image {
                width: 32px;
                height: 32px;
                margin-right: 5px;
                border-radius: 50%;
                background-color: var(--body-background-color-darker);
                position: relative;
            }
            .application-image iron-icon {
                width: 18px;
                height: 18px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
            :host .application-name {
                @apply --paper-font-subhead;
                font-size: 18px;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">
            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-header">
                    oAuth Applications
                </div>

                <div class="resource-content">
                    <p>
                        OAuth applications are different apps and services which use OAuth as authorization protocol.
                        OAuth is commonly used to grant access and share information from one application or website to another,
                        without sharing any credentials.
                    </p>
                    <p>
                        The OAuth application will communicate with AppsCo in order to authorize users. This means the users will log in to OAuth
                        applications using secure delegated access trough AppsCo. OAuth application will be granted a permission to access their AppsCo account
                        information in order to authorize the user but without providing any passwords.
                    </p>
                    <p>
                        Note that sharing of different resources (applications, SSO applications, links and other items) to users and contacts
                        is not performed here but on Resources page.
                    </p>

                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-oauth-applications id="oAuthApplications" size="100" load-more="" type="oauth-applications" authorization-token="[[ authorizationToken ]]" list-api="[[ oAuthApplicationsApi ]]" on-item="_onOAuthApplicationAction" on-list-loaded="_onOAuthApplicationsLoaded" on-list-empty="_onOAuthApplicationsEmptyLoad" on-remove-oauth-application="_onRemoveOAuthApplicationAction">
                    </appsco-oauth-applications>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <div class="application-image">
                        <iron-icon icon="device:widgets"></iron-icon>
                    </div>
                    <span class="application-name flex">[[ oAuthApplication.title ]]</span>
                </div>

                <div class="info-content flex-vertical">
                    <appsco-oauth-application-info o-auth-application="[[ oAuthApplication ]]"></appsco-oauth-application-info>
                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="button flex" on-tap="_onInfoEditAction">
                        Edit
                    </paper-button>
                </div>

            </div>
        </appsco-content>

        <appsco-remove-oauth-application id="appscoRemoveOAuthApplication" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-remove-oauth-application>

        <appsco-add-oauth-application id="appscoAddOauthApplication" authorization-token="[[ authorizationToken ]]" oauth-applications-api="[[ oAuthApplicationsApi ]]" company="[[ currentCompany ]]" api-errors="[[ apiErrors ]]" on-oauth-application-added="_onOauthApplicationAdded">
        </appsco-add-oauth-application>
`;
    }

    static get is() { return 'appsco-oauth-applications-page'; }

    static get properties() {
        return {
            oAuthApplication: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            currentCompany: {
                type: Object
            },

            oAuthApplicationsApi: {
                type: String
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

            _oAuthApplicationSelectAction: {
                type: Number,
                value: 0
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
            '_updateScreen(mobileScreen, tabletScreen)'
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
            if (this.mobileScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('add-oauth-application', this._onAddOAuthApplicationAction.bind(this));
    }

    initializePage() {
        this._setDefaultOAuthApplication();
    }

    _setDefaultOAuthApplication() {
        this.set('oAuthApplication', this.$.oAuthApplications.getFirstItem());
    }

    _updateScreen() {
        this.updateStyles();
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.initializePage();
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _resetPageList() {
        this.$.oAuthApplications.resetAllItems();
    }

    resetPage() {
        this.hideInfo();
        this._resetPageList();
    }

    _onOAuthApplicationsLoaded() {
        this._onPageLoaded();
    }

    _onOAuthApplicationsEmptyLoad() {
        this._onPageLoaded();
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
    }

    reloadOAuthApplications() {
        this.$.oAuthApplications.reloadItems();
    }

    _onOAuthApplicationAction(event) {
        if (event.detail.item.activated) {
            this.set('oAuthApplication', event.detail.item);
            this._showInfo();
        }
        else {
            this.hideInfo();
            this._setDefaultOAuthApplication();
        }
    }

    _onInfoEditAction() {
        this.dispatchEvent(new CustomEvent('edit-oauth-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.oAuthApplication
            }
        }));
    }

    _onAddOAuthApplicationAction() {
        this.shadowRoot.getElementById('appscoAddOauthApplication').open();
    }

    _onOauthApplicationAdded(event) {
        const application = event.detail.application;

        this.reloadOAuthApplications();
        this.hideInfo();

        this._notify('OAuth application ' + application.title + ' has been successfully added.');
    }

    _onRemoveOAuthApplicationAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoRemoveOAuthApplication');
        dialog.setApplication(event.detail.application);
        dialog.open();
    }
}
window.customElements.define(AppscoOauthApplicationsPage.is, AppscoOauthApplicationsPage);
