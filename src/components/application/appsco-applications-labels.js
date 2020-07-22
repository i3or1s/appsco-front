import '@polymer/polymer/polymer-legacy.js';
import './appsco-applications.js';
import './appsco-applications-label.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import {beforeNextRender} from "@polymer/polymer/lib/utils/render-status";

class AppscoApplicationsLabels extends mixinBehaviors([
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        
        <template is="dom-repeat" items="[[ labels ]]">
            <appsco-applications-label
                authorization-token="[[ authorizationToken ]]"
                account="[[ account ]]"
                label="[[ item ]]"
                size="[[ size ]]"
                on-empty-load="_onApplicationsLoaded"
                on-loaded="_onApplicationsLoaded">
            </appsco-applications-label>            
        </template>
`;
    }

    static get is() { return 'appsco-applications-labels'; }

    static get properties() {
        return {
            account: {
                type: Object
            },

            size: {
                type: Number,
                value: 20
            },

            labels: {
                type: Array
            }
        };
    }

    _labelComponents() {
        return Array.from(this.shadowRoot.querySelectorAll('appsco-applications-label'));
    }

    initializeResourcesDragBehavior() {
        setTimeout(function() {
            this._labelComponents().forEach((component) => component.initializeResourcesDragBehavior());
        }.bind(this), 500);
    }

    setDisplayStyle(displayStyle) {
        beforeNextRender(this, function() {
            this._labelComponents().forEach((component) => component.setDisplayStyle(displayStyle));
        });
    }

    setSort(sort) {
        beforeNextRender(this, function() {
            this._labelComponents().forEach((component) => component.setSort(sort));
        });
    }

    addApplications(applications) {
        applications.forEach(function(application) {
            const component = this._findComponentForApplication(application);
            if (component) {
                component.addApplications([application]);
            }
        }.bind(this));
    }

    _findComponentForApplication(application) {
        if (!application.application.company) {
            return this._labelComponents()[0];
        }

        return this._labelComponents().find((component) => { return component.isLabelForCompany(application.application.company) });
    }

    modifyApplications(applications) {
        applications.forEach(function(application) {
            const component = this._findComponentForApplication(application);
            if (component) {
                component.modifyApplications([application]);
            }
        }.bind(this));
    }

    reloadApplications() {
        this._labelComponents().forEach((component) => component.reloadApplications());
    }

    removeApplications(applications) {
        applications.forEach(function(application) {
            const component = this._findComponentForApplication(application);
            if (component) {
                component.removeApplications([application]);
            }
        }.bind(this));
    }

    getFirstApplication() {
        return this._labelComponents()[0].getFirstApplication();
    }

    filterByStatus(api) {
        this._labelComponents().forEach((component) => component.filterByStatus(api));
    }

    filterByTerm(term) {
        this._labelComponents().forEach((component) => component.filterByTerm(term));
    }

    reset() {
        this._labelComponents().forEach((component) => component.reset());
    }

    _onApplicationsLoaded() {
        this._labelComponents().forEach((component) => component._applicationsLoaded);
    }
}
window.customElements.define(AppscoApplicationsLabels.is, AppscoApplicationsLabels);
