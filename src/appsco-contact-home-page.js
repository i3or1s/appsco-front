import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/application/appsco-applications.js';
import './components/application/appsco-application-info.js';
import './components/application/appsco-application-security.js';
import './components/application/appsco-application-subscribers.js';
import './components/application/appsco-application-details.js';
import './components/application/appsco-application-log.js';
import './company/appsco-contact-home-page-actions.js';
import './components/application/appsco-application-revoke.js';
import './application/appsco-application-settings-dialog.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContactHomePage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --paper-tabs-selection-bar-color: var(--app-primary-color);

                --appsco-application-item: {
                    color: var(--primary-text-color);
                };

                --appsco-list-item-message: {
                    font-size: 14px;
                    @apply --text-wrap-break;
                };
                --application-log-item: {
                    padding-bottom: 6px;
                };

                --application-details-label: {
                    font-size: 12px;
                };
                --application-details-value: {
                    font-size: 14px;
                };

                --applications-container: {
                    margin-right: -30px;
                };
            }
            appsco-application-security {
                --security-score: {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                };
            }
            :host appsco-application-subscribers {
                height: 50px;
            }
            :host div[info] .info-details-section {
                margin-top: 6px;
                height: calc(100% - 48px - 35px - 6px);
            }
            .tab-content {
                margin-right: -10px;
                padding-right: 10px;
                overflow: auto;
            }
            :host .view-button {
                margin-right: 1px;
            }
            appsco-application-details {
                --appsco-application-icons-color: var(--primary-text-color);
            }
            :host([laptop-screen]) {
                --appsco-application-item: {
                    width: 131px;
                };

                --info-width: 290px;
            }

            :host([tablet-s1280-screen]) {
                --appsco-application-item: {
                    width: 141px;
                };

                --info-width: 318px;
            }

            :host([tablet-s1024-screen]) {
                --appsco-application-item: {
                    width: 127px;
                };

                --info-width: 290px;
            }

            :host([tablet-screen]) {
                --appsco-application-item: {
                    width: 140px;
                };
            }

            :host([mobile-screen]) {
                --applications-container: {
                    margin-right: -25px;
                    display: block;
                    @apply --layout-horizontal;
                    @apply --layout-around-justified;
                };
            }
        </style>

        <iron-media-query query="(max-width: 1366px)" query-matches="{{ laptopScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1280px)" query-matches="{{ tabletS1280Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1024px)" query-matches="{{ tabletS1024Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-applications id="appscoApplications" size="100" load-more="" is-on-company="" authorization-token="[[ authorizationToken ]]" applications-api="[[ applicationsApi ]]" on-info="_onViewApplicationInfo" on-edit="_onApplicationEdit" on-edit-shared-application="_onEditSharedApplication" on-application="_onApplication" on-application-removed="_onApplicationRemoved" on-loaded="_pageLoaded" on-empty-load="_pageLoaded"></appsco-applications>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">

                <div class="info-header flex-horizontal">
                    <appsco-application-info class="flex" application="[[ application ]]">
                    </appsco-application-info>

                    <template is="dom-if" if="[[ application.claims.password ]]">
                        <appsco-application-security application="[[ application ]]"></appsco-application-security>
                    </template>
                </div>

                <div class="info-content flex-vertical">
                    <template is="dom-if" if="[[ !_shared ]]">
                        <appsco-application-subscribers application="[[ application ]]" authorization-token="[[ authorizationToken ]]" preview="">
                        </appsco-application-subscribers>
                    </template>

                    <template is="dom-if" if="[[ !_shared ]]">
                        <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                            <paper-tab name="details">Details</paper-tab>
                            <paper-tab name="log">Log</paper-tab>
                        </paper-tabs>

                        <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="info-details-section">

                            <div name="details" class="tab-content details">
                                <appsco-application-details application="[[ application ]]">
                                </appsco-application-details>
                            </div>

                            <div name="log" class="tab-content log">
                                <appsco-application-log application="[[ application ]]" authorization-token="[[ authorizationToken ]]">
                                </appsco-application-log>
                            </div>

                        </neon-animated-pages>
                    </template>

                    <template is="dom-if" if="[[ _shared ]]">
                        <div name="details">
                            <appsco-application-details application="[[ application ]]">
                            </appsco-application-details>
                        </div>
                    </template>
                </div>

                <template is="dom-if" if="[[ !_shared ]]">
                    <div class="info-actions flex-horizontal">
                        <paper-button class="button view-button flex" on-tap="_onApplicationInfoEdit">
                            Edit
                        </paper-button>
                    </div>
                </template>

                <template is="dom-if" if="[[ _editClaims ]]">
                    <div class="info-actions flex-horizontal">
                        <paper-button class="button view-button flex" on-tap="_onApplicationEditCredentials">
                            Edit Credentials
                        </paper-button>
                    </div>
                </template>

                <template is="dom-if" if="[[ application.permisions.revoke ]]">
                    <div class="info-actions flex-horizontal">
                        <paper-button class="button danger-button flex" on-tap="_onRevokeApplication">
                            Revoke
                        </paper-button>
                    </div>
                </template>

            </div>

        </appsco-content>

        <appsco-application-revoke id="appscoApplicationRevoke" authorization-token="[[ authorizationToken ]]" on-application-instance-removed="_onApplicationInstanceRevoked">
        </appsco-application-revoke>

        <appsco-application-settings-dialog id="appscoApplicationSettingsDialog" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" on-application-settings-saved="_onApplicationCredentialsChanged">
        </appsco-application-settings-dialog>
`;
    }

    static get is() { return 'appsco-contact-home-page'; }

    static get properties() {
        return {
            application: {
                type: Object,
                notify: true
            },

            account: {
                type: Object
            },

            applicationsApi: {
                type: String
            },

            pageConfig: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onPageConfigChanged'
            },

            _applications: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _shared: {
                type: Boolean,
                computed: '_computeApplicationShared(application)',
                notify: true
            },

            _selectedTab: {
                type: Number
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _editClaims: {
                type: Boolean,
                computed: '_computeEditClaims(application)',
                notify: true
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

            tabletS1024Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS1280Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            laptopScreen: {
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
            '_updateScreen(mobileScreen, tabletScreen, tabletS1024Screen, tabletS1280Screen, laptopScreen)'
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
            if (this.mobileScreen || this.tabletScreen || this.tabletS1024Screen || this.tabletS1280Screen || this.laptopScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('search', this._onSearchApplications.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchApplicationsClear.bind(this));
    }

    initializePage() {
        this.setDefaultApplication();
    }

    resetPage() {
        this.$.appscoApplications.reset();
        this._hideInfo();
    }

    setDefaultApplication () {
        this.set('application', this.$.appscoApplications.getFirstApplication());
    }

    setApplication(application) {
        this.application = application;
        this.$.appscoApplications.modifyApplications([application]);
    }

    removeApplications (applications) {
        this.$.appscoApplications.removeApplications(applications);
    }

    filterApplicationsByTerm(term) {
        this.$.appscoApplications.filterByTerm(term);
    }

    toggleInfo() {
        this.$.appscoContent.toggleSection('info');
        this._infoShown = !this._infoShown;

        if (this._infoShown) {
            this._selectedTab = 0;
        }
    }

    _pageLoaded () {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
        this._selectedTab = 0;
    }

    _hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    _updateScreen (mobile, tablet, tabletS1024Screen, tabletS1280Screen, laptop) {
        this.updateStyles();
    }

    _computeApplicationShared(application) {
        return application && !application.owner;
    }

    _computeEditClaims(application) {
        return application.permisions && application.permisions.edit_claims;
    }

    _onViewApplicationInfo(event) {
        this.set('application', event.detail.application);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onApplicationEdit (event) {
        this.set('application', event.detail.application);
        this.dispatchEvent(new CustomEvent('edit-application', { bubbles: true, composed: true }));
    }

    _onEditSharedApplication(event) {
        this.dispatchEvent(new CustomEvent('edit-shared-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: event.detail.application
            }
        }));
    }

    _onApplicationRemoved() {
        this.setDefaultApplication();
    }

    _onApplication (event) {
        if(['unpw', 'item', 'none', 'saml', 'saml_dropbox', 'saml_office_365'].indexOf(event.detail.application.auth_type) > -1) {
            window.open(event.detail.application.meta.plugin_go, "_blank");
        } else {
            this._onViewApplicationInfo(event);
        }
    }

    _onApplicationInfoEdit() {
        this.dispatchEvent(new CustomEvent('info-edit-application', { bubbles: true, composed: true }));
    }

    _onRevokeApplication() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationRevoke');
        dialog.applicationInstance = this.application;
        dialog.open();
    }

    _onApplicationInstanceRevoked(event) {
        this.removeApplications([event.detail.applicationInstance]);
        this.setDefaultApplication();
        this._notify('You have successfully revoked access to ' + event.detail.applicationInstance.application.title + '.');
    }

    _onApplicationEditCredentials() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationSettingsDialog');
        dialog.setApplication(event.detail.application);
        dialog.toggle();
    }

    _onPageConfigChanged(newValue) {
        newValue = newValue[this.getAttribute('name')];

        if (!newValue) {
            return false;
        }

        const appscoApplicationsComponent = this.$.appscoApplications;

        if (newValue.display_style) {
            appscoApplicationsComponent.setDisplayStyle(newValue.display_style);
        }

        if (newValue.sort_field && 'undefined' !== typeof newValue.sort_ascending) {
            appscoApplicationsComponent.setSort({
                orderBy: newValue.sort_field,
                ascending: newValue.sort_ascending
            });
        }
    }

    _onSearchApplications(event) {
        this._showProgressBar();
        this.filterApplicationsByTerm(event.detail.term);
    }

    _onSearchApplicationsClear() {
        this.filterApplicationsByTerm('');
    }

    _onApplicationCredentialsChanged(event) {
        const application = event.detail.application,
            message = 'You successfully changed ' + application.title + ' credentials.';

        this._notify(message);
    }
}
window.customElements.define(AppscoContactHomePage.is, AppscoContactHomePage);
