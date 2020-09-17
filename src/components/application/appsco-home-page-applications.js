import '@polymer/polymer/polymer-legacy.js';
import './appsco-applications.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { beforeNextRender } from "@polymer/polymer/lib/utils/render-status";
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoHomePageApplications extends mixinBehaviors([
    Appsco.HeadersMixin
], DisableUpgradeMixin(PolymerElement)) {
    static get template() {
        return html`
            <appsco-applications
                id="appscoApplications"
                name="applications"
                size="100"
                load-more=""
                authorization-token="[[ authorizationToken ]]"
                applications-api="[[ applicationsApi ]]"
                account="[[ account ]]">
            </appsco-applications>`;
    }

    static get is() { return 'appsco-home-page-applications'; }

    static get properties() {
        return {
            account: {
                type: Object
            },

            size: {
                type: Number,
                value: 20
            },

            applicationsApi: {
                type: String
            },

            personalItemsApi: {
                type: String
            },

            sharedWithMeItemsApi: {
                type: String
            }
        };
    }

    initializeResourcesDragBehavior() {
        setTimeout(function() {
            this.$.appscoApplications.initializeResourcesDragBehavior();
        }.bind(this), 500);
    }

    setDisplayStyle(displayStyle) {
        beforeNextRender(this, function() {
            this.$.appscoApplications.setDisplayStyle(displayStyle);
        });
    }

    setSort(sort) {
        beforeNextRender(this, function() {
            this.$.appscoApplications.setSort(sort);
        });
    }

    showOnlyPersonal() {
        this.$.appscoApplications.applicationsApi = this.personalItemsApi;
    }

    showOnlyShared() {
        this.$.appscoApplications.applicationsApi = this.sharedWithMeItemsApi;
    }

    showAll() {
        this.$.appscoApplications.applicationsApi = this.applicationsApi;
    }

    showGroup(group) {
        this.$.appscoApplications.applicationsApi = group.self + '/no-personal-dashboard-icons';
    }

    showSharedByCompany(company) {
        this.$.appscoApplications.applicationsApi = company.self + '/dashboard-groups/no-personal-dashboard-icons';
    }

    addApplications(applications) {
        applications.forEach(function(application) {
            this.$.appscoApplications.addApplications([application]);
        }.bind(this));
    }

    modifyApplications(applications) {
        applications.forEach(function(application) {
            this.$.appscoApplications.modifyApplications([application]);
        }.bind(this));
    }

    reloadApplications() {
        this.$.appscoApplications.reloadApplications();
    }

    removeApplications(applications) {
        this.$.appscoApplications.removeApplications(applications);
    }

    getFirstApplication() {
        return this.$.appscoApplications.getFirstApplication();
    }

    filterByStatus(api) {
        this.$.appscoApplications.filterByStatus(api);
    }

    filterByTerm(term) {
        this.$.appscoApplications.filterByTerm(term);
    }

    reset() {
        this.$.appscoApplications.reset();
    }
}
window.customElements.define(AppscoHomePageApplications.is, AppscoHomePageApplications);
