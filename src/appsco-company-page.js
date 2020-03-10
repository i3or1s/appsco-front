import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './company/appsco-company-components-page.js';
import './company/appsco-company-settings-page.js';
import './company/appsco-company-brand-settings-page.js';
import './company/appsco-company-branded-login-page.js';
import './company/appsco-company-domains-page.js';
import './company/appsco-company-transfer-token-page.js';
import './company/appsco-company-manage-idp-settings-page.js';
import './company/appsco-company-page-actions.js';
import './company/appsco-company-add-domain.js';
import './company/appsco-company-add-certificate.js';
import './company/appsco-company-remove-domain.js';
import './company/appsco-deactivate-idp-settings.js';
import './company/appsco-company-domain-token.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host div[resource] {
                height: 100%;
                padding: 0;
            }
            :host div[resource] > .resource-header, :host div[resource] > .resource-content {
                padding: 10px;
            }
            .info-icon {
                margin-right: 4px;
            }
            :host .company-branded-login {
                margin-top: 10px;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    [[ company.name ]]
                </div>

                <div class="resource-content">
                    <div class="company-contact-email">
                        <iron-icon icon="communication:email" class="info-icon"></iron-icon>
                        [[ company.contact_email ]]
                    </div>
                    <div class="company-branded-login">
                        <div>Company login URL: </div>
                        <span class="branded-login-url">[[ company.meta.branded_login_url]]</span>
                    </div>
                </div>
            </div>

            <div content="" slot="content">

                <div class="content-container">
                    <neon-animated-pages class="flex" selected="[[ _selected ]]" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

                        <appsco-company-components-page
                            id="appscoCompanyComponentsPage"
                            name="appsco-company-components-page"
                            company="[[ company ]]"
                            brand-logo="[[ brandLogo ]]"
                            authorization-token="[[ authorizationToken ]]"
                            domains-api="[[ _domainsApi ]]"
                            on-loaded="_onPageLoaded"
                            on-empty-load="_onPageLoaded"
                            on-manage-company-settings="_onManageCompanySettings"
                            on-manage-company-brand-settings="_onManageCompanyBrandSettings"
                            on-manage-company-branded-login="_onManageCompanyBrandedLogin"
                            on-manage-company-domains="_onManageCompanyDomains"
                            on-manage-company-transfer-token="_onManageCompanyTransferToken"
                            on-manage-company-idp-settings="_onManageCompanyIdPSettings">
                        </appsco-company-components-page>

                        <appsco-company-settings-page
                            id="appscoCompanySettingsPage"
                            name="appsco-company-settings-page"
                            company="[[ company ]]"
                            authorization-token="[[ authorizationToken ]]"
                            settings-api="[[ _settingsApi ]]"
                            save-ip-white-list-api="[[ saveIpWhiteListApi ]]"
                            api-errors="[[ apiErrors ]]"
                            on-company-settings-changed="_onSettingsChanged"
                            on-back="_onResourceBack">
                        </appsco-company-settings-page>

                        <appsco-company-brand-settings-page
                            id="appscoCompanyBrandSettingsPage"
                            name="appsco-company-brand-settings-page"
                            company="[[ company ]]"
                            authorization-token="[[ authorizationToken ]]"
                            settings-api="[[ _brandSettingsApi ]]"
                            image-settings-api="[[ _imageSettingsApi ]]"
                            dashboard-image-settings-api="[[ _dashboardImageSettingsApi ]]"
                            on-company-brand-settings-changed="_onCompanyBrandSettingsChanged"
                            on-back="_onResourceBack">
                        </appsco-company-brand-settings-page>

                        <appsco-company-branded-login-page
                            id="appscoCompanyBrandedLoginPage"
                            name="appsco-company-branded-login-page"
                            company="[[ company ]]"
                            authorization-token="[[ authorizationToken ]]"
                            on-company-branded-login-changed="_showCompanyComponentsPage"
                            on-back="_onResourceBack">
                        </appsco-company-branded-login-page>

                        <appsco-company-manage-idp-settings-page id="appscoCompanyManageIdPSettingsPage" name="appsco-company-manage-idp-settings-page" company="[[ company ]]" authorization-token="[[ authorizationToken ]]" id-p-integrations-api="[[ _idPIntegrationsApi ]]" domains-api="[[ _domainsApi ]]" api-errors="[[ apiErrors ]]" on-company-settings-changed="_onSettingsChanged" on-deactivate-domain-idp-settings="_onDeactivateDomainIdPSettings" on-idp-certificate-add="_onAddIdpCertificate" on-idp-settings-saved="_onIdPSettingsSaved" on-back="_onResourceBack">
                        </appsco-company-manage-idp-settings-page>

                        <appsco-company-domains-page id="appscoCompanyDomainsPage" name="appsco-company-domains-page" authorization-token="[[ authorizationToken ]]" domains-api="[[ _domainsApi ]]" on-remove-domain="_onRemoveDomain" on-get-token="_onDomainGetToken" on-domain-not-verified="_onDomainNotVerified" on-show-domains-page-actions="_onShowDomainsPageActions" on-hide-domains-page-actions="_onHideDomainsPageActions" on-back="_onResourceBack">
                        </appsco-company-domains-page>

                        <appsco-company-transfer-token-page name="appsco-company-transfer-token-page" authorization-token="[[ authorizationToken ]]" transfer-token-api="[[ transferTokenApi ]]" partners-api-url="[[ partnersApiUrl ]]" send-transfer-token-api="[[ sendTransferTokenApi ]]" on-transfer-token-sent="_onTransferTokenSent" api-errors="[[ apiErrors ]]" on-back="_onResourceBack">
                        </appsco-company-transfer-token-page>
                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <appsco-company-add-domain
            id="appscoCompanyAddDomain"
            authorization-token="[[ authorizationToken ]]"
            add-domain-api="[[ _domainsApi ]]"
            api-errors="[[ apiErrors ]]">
        </appsco-company-add-domain>

        <appsco-company-add-certificate id="appscoCompanyAddCertificate"></appsco-company-add-certificate>

        <appsco-company-remove-domain
            id="appscoCompanyRemoveDomain"
            authorization-token="[[ authorizationToken ]]">
        </appsco-company-remove-domain>

        <appsco-company-domain-token id="appscoCompanyDomainToken"></appsco-company-domain-token>

        <appsco-deactivate-idp-settings
            id="appscoDeactivateIdPSettings"
            authorization-token="[[ authorizationToken ]]"
            api-errors="[[ apiErrors ]]"
            on-idp-settings-deactivated="_onIdPSettingsDeactivated">
        </appsco-deactivate-idp-settings>`;
    }

    static get is() { return 'appsco-company-page'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            transferTokenApi: {
                type: String
            },

            sendTransferTokenApi: {
                type: String
            },

            partnersApiUrl: {
                type: String
            },

            saveIpWhiteListApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _settingsApi: {
                type: String,
                computed: '_computeSettingsApi(company)'
            },

            _brandSettingsApi: {
                type: String,
                computed: '_computeBrandSettingsApi(company)'
            },

            _imageSettingsApi: {
                type: String,
                computed: '_computeImageSettingsApi(company)'
            },

            _dashboardImageSettingsApi: {
                type: String,
                computed: '_computeDashboardImageSettingsApi(company)'
            },

            _domainsApi: {
                type: String,
                computed: '_computeDomainsApi(company)'
            },

            groupsApi: {
                type: String,
                computed: '_computeGroupsApi(company)'
            },

            _idPIntegrationsApi: {
                type: String,
                computed: '_computeIdPIntegrationsApi(company)'
            },

            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
            _selected: {
                type: String,
                value: 'appsco-company-components-page',
                notify: true
            },

            showDomainsPage: {
                type: Boolean,
                value: false,
                observer: '_observeShowDomainsPage'
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

            pageLoaded: {
                type: Boolean,
                value: false
            },

            brandLogo: {
                type: String,
                value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAgCAYAAAB+ZAqzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVZJREFUeNrsmOENgjAQhcE4AG5QN2AERnCEjsAIdQJG6AiO0BEcATdwhLONxJR6V1u8Ij98ycXkrL3HR+8gVlWCAEDa0EjuaqP1csLGkPJ7FtlNR3hKIzknNeV0uC5YqzhNSc/AiORgKiyCnCbWSm5ar02DHEzFhyB3J9aCf/tL02qckSCvbHSAy60Va9BSSGFn1gAt1zjNlmj5Mr+gdYE0aXZahFmFdOgnSW5aEikivHmWo1NJWnoBLf8ItFujNWumErSwDs3V+xjJoNURtBTwSC6lZQrRmtXhoNXa6IFPIwctE3lYf3crv6TVER26Ki29RVpiNVoJkz+FlmGnlTD5Y7ROia82q9Iat0ALG5xyml3laUXMqkSKZWgRpiha4k+LMPYzWvuYsbquDxhFxn8fzmTt3DNnP9xVNgymbvbCj9SXu8zNeiZTUVocZ27pe/3HA/8QYABzJAP50CmRFwAAAABJRU5ErkJggg=='
            }
        };
    }

    static get observers(){
        return [
            '_updateScreen(tabletScreen, mobileScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.tabletScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this._onResourceActionCompanyPage.bind(this));
        this.toolbar.addEventListener('add-domain', this._onAddDomain.bind(this));
        this.toolbar.addEventListener('search-groups', this._onSearchGroups.bind(this));
        this.toolbar.addEventListener('search-groups-clear', this._onSearchGroupsClear.bind(this));
    }

    resetPage() {
        this._showCompanyComponentsPage();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    addDomain(domain) {
        this.$.appscoCompanyComponentsPage.addDomain(domain);
        this.$.appscoCompanyDomainsPage.addDomain(domain);
    }

    modifyDomain(domain) {
        this.$.appscoCompanyComponentsPage.modifyDomain(domain);
        this.$.appscoCompanyDomainsPage.modifyDomain(domain);
        this.$.appscoCompanyManageIdPSettingsPage.modifyDomain(domain);
    }

    removeDomain(domain) {
        this.$.appscoCompanyComponentsPage.removeDomain(domain);
        this.$.appscoCompanyDomainsPage.removeDomain(domain);
        this.reloadIdPDomains();
    }

    reloadIdPDomains() {
        this.$.appscoCompanyManageIdPSettingsPage.reloadDomains();
    }

    showManageDomainsPage() {
        this.$.appscoCompanyComponentsPage.setSharedElement('domains');

        setTimeout(function() {
            this._showCompanyDomainsPage();
            this.showDomainsPage = false;
        }.bind(this), 50);
    }

    _observeShowDomainsPage(show) {
        if (show) {
            this.showManageDomainsPage();
        }
    }

    _computeSettingsApi(company) {
        return (company.meta && company.meta.settings) ? company.meta.settings : null;
    }

    _computeBrandSettingsApi(company) {
        return company.self ? (company.self + '/branding') : null;
    }

    _computeImageSettingsApi(company) {
        return (company.meta && company.meta.logo) ? company.meta.logo : null;
    }

    _computeDashboardImageSettingsApi(company) {
        return (company.meta && company.meta.dashboard_logo) ? company.meta.dashboard_logo : '';
    }

    _computeDomainsApi(company) {
        return (company.meta && company.meta.domains) ? company.meta.domains + '?extended=1' : null;
    }

    _computeGroupsApi(company) {
        return company.self ? (company.self + '/groups') : null;
    }

    _computeIdPIntegrationsApi(company) {
        return company.self ? (company.self + '/settings/idps/integrations') : null;
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

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _showCompanyComponentsPage() {
        this._selected = 'appsco-company-components-page';
    }

    _showCompanySettingsPage() {
        this._selected = 'appsco-company-settings-page';
    }

    _showCompanyBrandSettingsPage() {
        this._selected = 'appsco-company-brand-settings-page';
    }

    _showCompanyBrandedLoginPage() {
        this._selected = 'appsco-company-branded-login-page';
    }

    _showCompanyDomainsPage() {
        this._selected = 'appsco-company-domains-page';
    }

    _showCompanyTransferTokenPage() {
        this._selected = 'appsco-company-transfer-token-page';
    }

    _showCompanyManageIdPSettings() {
        this._selected = 'appsco-company-manage-idp-settings-page';
    }

    _onResourceBack() {
        this._showCompanyComponentsPage();
    }

    _onManageCompanySettings() {
        this._showCompanySettingsPage();
    }

    _onSettingsChanged() {
        this._showCompanyComponentsPage();
    }

    _onManageCompanyBrandSettings() {
        this._showCompanyBrandSettingsPage();
    }

    _onManageCompanyBrandedLogin() {
        this._showCompanyBrandedLoginPage();
    }

    _onCompanyBrandSettingsChanged() {
        this._showCompanyComponentsPage();
    }

    _onManageCompanyDomains() {
        this._showCompanyDomainsPage();
    }

    _onManageCompanyTransferToken() {
        this._showCompanyTransferTokenPage();
    }

    _onManageCompanyIdPSettings() {
        this._showCompanyManageIdPSettings();
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        switch(fromPage.getAttribute('name')) {
            case 'appsco-company-settings-page':
            case 'appsco-company-domains-page':
            case 'appsco-company-transfer-token-page':
                fromPage.resetPage();
                break;
            default:
                break;
        }

        switch(toPage.getAttribute('name')) {
            case 'appsco-company-settings-page':
            case 'appsco-company-domains-page':
                toPage.setupPage();
                break;
            default:
                break;
        }
    }

    _onResourceActionCompanyPage() {
        this.toolbar.toggleResource();
    }

    _onAddDomain() {
        this.shadowRoot.getElementById('appscoCompanyAddDomain').open();
    }

    _onRemoveDomain(event) {
        const dialog = this.shadowRoot.getElementById('appscoCompanyRemoveDomain');
        dialog.setDomain(event.detail.domain);
        dialog.open();
    }

    _onAddIdpCertificate(event) {
        const dialog = this.shadowRoot.getElementById('appscoCompanyAddCertificate');
        dialog.setSource(event);
        dialog.open();
    }

    _searchGroups(term) {
        this._showProgressBar();
        this.searchGroups(term);
    }

    _onSearchGroups(event) {
        this._searchGroups(event.detail.term);
    }

    _onSearchGroupsClear() {
        this._searchGroups('');
    }

    _onDomainGetToken(event) {
        const dialog = this.shadowRoot.getElementById('appscoCompanyDomainToken');
        dialog.setDomain(event.detail.domain);
        dialog.open();
    }

    _onTransferTokenSent() {
        this._notify('Transfer token email has been successfully sent.');
    }

    _onShowDomainsPageActions() {
        this.toolbar.showDomainsPageActions();
    }

    _onHideDomainsPageActions() {
        this.toolbar.hideDomainsPageActions();
    }

    _onIdPSettingsSaved(event) {
        this._notify('IdP settings for ' + event.detail.domain.domain + ' domain was successfully saved.');
    }

    _onDeactivateDomainIdPSettings(event) {
        const dialog = this.shadowRoot.getElementById('appscoDeactivateIdPSettings');
        dialog.setDomain(event.detail.domain);
        dialog.open();
    }

    _onIdPSettingsDeactivated(event) {
        const domain = event.detail.domain;

        this.modifyDomain(domain);
        this._notify('IdP settings for ' + domain.domain + ' domain was successfully deactivated.');
    }

    _onDomainNotVerified(event) {
        const domain = event.detail.domain;
        this._notify('Unable to verify ' + domain.domain + ' domain - please wait until the DNS record change is propagated.', true);
    }
}
window.customElements.define(AppscoCompanyPage.is, AppscoCompanyPage);
