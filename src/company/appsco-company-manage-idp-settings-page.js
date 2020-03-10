import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import './appsco-company-idp-domains-page.js';
import './appsco-company-idp-settings-page.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyManageIdpSettingsPage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    NeonAnimatableBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                overflow: hidden;
            }
            :host neon-animated-pages {
                height: 100%;
            }
        </style>

        <neon-animated-pages class="flex" selected="[[ _selectedPage ]]" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

            <appsco-company-idp-domains-page
                id="appscoCompanyIdPDomainsPage"
                name="appsco-company-idp-domains-page"
                domains-api="[[ domainsApi ]]"
                authorization-token="[[ authorizationToken ]]"
                on-manage="_onManageDomain">
            </appsco-company-idp-domains-page>

            <appsco-company-idp-settings-page
                id="appscoCompanyIdPSettingsPage"
                name="appsco-company-idp-settings-page"
                company="[[ company ]]"
                id-p-integrations-api="[[ idPIntegrationsApi ]]"
                authorization-token="[[ authorizationToken ]]"
                api-errors="[[ apiErrors ]]"
                on-idp-settings-saved="_onIdPSettingsSaved"
                on-back="_onBackIdPSettingsPage">
            </appsco-company-idp-settings-page>

        </neon-animated-pages>
`;
    }

    static get is() { return 'appsco-company-manage-idp-settings-page'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            authorizationToken: {
                type: String
            },

            idPIntegrationsApi: {
                type: String
            },

            domainsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _selectedPage: {
                type: String,
                value: 'appsco-company-idp-domains-page'
            },

            animationConfig: {
                type: Object
            },

            sharedElements: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': [{
                name: 'hero-animation',
                id: 'hero',
                toPage: this,
                timing: {
                    duration: 300
                }
            }, {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }],
            'exit': {
                name: 'slide-right-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };
        this.sharedElements = {
            'hero': this
        };
    }

    reloadDomains() {
        this.$.appscoCompanyIdPDomainsPage.reloadDomains();
    }

    modifyDomain(domain) {
        this.$.appscoCompanyIdPDomainsPage.modifyDomain(domain);
    }

    _showCompanyIdPDomainsPage() {
        this._selectedPage = 'appsco-company-idp-domains-page';
    }

    _showCompanyIdPSettingsPage() {
        this._selectedPage = 'appsco-company-idp-settings-page';
    }

    _onBackIdPSettingsPage(event) {
        event.stopPropagation();

        this._showCompanyIdPDomainsPage();
    }

    _onManageDomain(event) {
        this._showCompanyIdPSettingsPage();
        this.$.appscoCompanyIdPSettingsPage.setDomain(event.detail.domain);
    }

    _onIdPSettingsSaved(event) {
        this.$.appscoCompanyIdPDomainsPage.modifyDomain(event.detail.domain);
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        if('appsco-company-idp-settings-page' === fromPage.getAttribute('name')) {
            fromPage.resetPage();
        }

        if('appsco-company-idp-settings-page' === toPage.getAttribute('name')) {
            toPage.setupPage();
            return;
        }

        return false;
    }
}
window.customElements.define(AppscoCompanyManageIdpSettingsPage.is, AppscoCompanyManageIdpSettingsPage);
