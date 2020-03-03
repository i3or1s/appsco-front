import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/additional-options/appsco-additional-options-components-page.js';
import './components/additional-options/appsco-manage-idp-page.js';
import './components/additional-options/appsco-additional-options-page-actions.js';
import './components/resource/appsco-idp-resource-add.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAdditionalOptionsPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host {
                --item-basic-info: {
                    padding: 0 10px;
                };
            }
            :host div[resource] .resource-header {
                padding: 10px;
            }
            :host div[resource] > .resource-content p {
                margin-bottom: 10px;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-header">
                    Resources additional options
                </div>
                <div class="resource-content">
                    <p class="info">
                        Additional options may vary depending
                        on the Identity provider and integrations you have set up for your company.
                    </p>
                    <p class="info">
                        This page simplifies the process of finding and adding the related resources to your company.
                    </p>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name">

                        <appsco-additional-options-components-page id="appscoAdditionalOptionsComponentsPage" name="appsco-additional-options-components-page" get-company-idp-config-list-api="[[ getCompanyIdpConfigListApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-idp-config-list-loaded="_onPageLoaded" on-manage-idp="_onManageIdP">
                        </appsco-additional-options-components-page>

                        <appsco-manage-idp-page id="appscoManageIdpPage" name="appsco-manage-idp-page" idp="[[ _idp ]]" authorization-token="[[ authorizationToken ]]" company="[[ company ]]" api-errors="[[ apiErrors ]]" on-add-item="_onAddIdPItemAction" on-list-loaded="_hideProgressBar" on-back="_onBack">
                        </appsco-manage-idp-page>
                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <appsco-idp-resource-add id="appscoIdpResourceAdd" authorization-token="[[ authorizationToken ]]" add-resource-api="[[ companyApplicationsApi ]]" link="[[ link ]]" api-errors="[[ apiErrors ]]" on-resource-added="_onIdpResourceAdded">
        </appsco-idp-resource-add>
`;
    }

    static get is() { return 'appsco-additional-options-page'; }

    static get properties() {
        return {
            getCompanyIdpConfigListApi: {
                type: String
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            company: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            CompanyApplicationsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
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

            link: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _idp: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _selected: {
                type: String,
                value: 'appsco-additional-options-components-page',
                notify: true
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
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
    }

    initializePage() {
        this.$.appscoAdditionalOptionsComponentsPage.initializePage();
    }

    resetPage() {
        this._showComponentsPage();
        this.$.appscoAdditionalOptionsComponentsPage.resetPage();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    modifyAddedResource(resource) {
        this.$.appscoManageIdpPage.modifyAddedResource(resource);
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if (!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _showComponentsPage() {
        this._selected = 'appsco-additional-options-components-page';
    }

    _showManagePage() {
        this._selected = 'appsco-manage-idp-page';
    }

    _onBack() {
        this._showComponentsPage();
    }

    _onManageIdP(event) {
        this.set('_idp', event.detail.idp);
        this._showManagePage();
    }

    _onAddIdPItemAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoIdpResourceAdd');
        dialog.setResource(event.detail.item);
        dialog.open();
    }

    _onIdpResourceAdded(event) {
        const resource = event.detail.resource;
        this.modifyAddedResource(event.detail.template);
        this._notify(resource.title + ' was successfully added.');
    }
}
window.customElements.define(AppscoAdditionalOptionsPage.is, AppscoAdditionalOptionsPage);
