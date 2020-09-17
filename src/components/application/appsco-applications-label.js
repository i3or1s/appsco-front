import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-collapse/iron-collapse.js';
import './appsco-applications.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import {beforeNextRender} from "@polymer/polymer/lib/utils/render-status";

class AppscoApplicationsLabel extends mixinBehaviors([
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host .text-title {
                margin: 20px 0 10px 0;
                font-size: 15px;
                cursor: pointer;
            }
        </style>
        
        <div hidden\$="[[ !_show ]]">
            <div class="text-title" on-tap="toggle">[[ label.name ]] ([[ _applicationCount ]]) <iron-icon icon="[[ icon ]]"></iron-icon></div>
            <iron-collapse id="ironCollapse" opened="true" on-opened-changed="_onOpenedChanged">
                <appsco-applications
                    id="appscoApplications"
                    size="[[ size ]]"
                    load-more=""
                    account="[[ account ]]"
                    display-style="[[ displayStyle ]]"
                    authorization-token="[[ authorizationToken ]]"
                    applications-api="[[ label.applicationsApi ]]"
                    on-applications-count-changed="_onApplicationsCountChanged">
                </appsco-applications>
            </iron-collapse>
        </div>
`;
    }

    static get is() { return 'appsco-applications-label'; }

    static get properties() {
        return {
            account: {
                type: Object
            },

            label: {
                type: Object
            },

            size: {
                type: Number,
                value: 20
            },

            opened: {
                type: Boolean,
                value: true
            },

            _applicationCount: {
                type: Number,
                value: 0
            },

            hideOnEmpty: {
                type: Boolean,
                value: true
            },

            collapseOnEmpty: {
                type: Boolean,
                value: true
            },

            displayStyle: {
                type: String
            },

            sort: {
                type: Object,
                observer: 'setSort'
            },

            _show: {
                type: Boolean,
                computed: '_computeShow(_applicationCount, hideOnEmpty)'
            },

            _group: {
                type: Object,
                observer: '_groupChanged'
            },

            icon: {
                type: String,
                computed: '_computeIcon(opened)'
            }
        };
    }

    _onOpenedChanged(event) {
        this.opened = event.detail.value;
    }

    _computeIcon(opened) {
        return opened ? 'arrow-drop-down' : 'arrow-drop-up';
    }

    _computeShow(_applicationCount, hideOnEmpty) {
        return _applicationCount > 0 || !hideOnEmpty;
    }

    setGroup(group) {
        this._group = group;
    }

    _groupChanged(group) {
        this.$.appscoApplications.applicationsApi = !group ? this.label.applicationsApi : group.self + '/no-personal-dashboard-icons';
    }

    _onApplicationsCountChanged(event) {
        const newCount = event.detail.count;
        const oldCount = this._applicationCount;
        this._applicationCount = newCount;
        if (!this.collapseOnEmpty) {
            this.expand();
            return;
        }
        if (0 === newCount) {
            this.collapse();
        }
        if (0 === oldCount && newCount > 0) {
            this.expand();
        }
    }

    initializeResourcesDragBehavior() {
        setTimeout(function() {
            this.$.appscoApplications.initializeDragBehavior();
        }.bind(this), 500);
    }

    setSort(sort) {
        beforeNextRender(this, function() {
            this.$.appscoApplications.setSort(sort);
        });
    }

    addApplications(applications) {
        this.$.appscoApplications.addApplications(applications);
    }

    modifyApplications(applications) {
        this.$.appscoApplications.modifyApplications(applications);
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

    toggle() {
        this.$.ironCollapse.toggle();
    }

    collapse() {
        this.$.ironCollapse.opened = false;
    }

    expand() {
        this.$.ironCollapse.opened = true;
    }

    isLabelForCompany(company) {
        if (!this.label.company || !company) {
            return false;
        }
        return this.label.company.self === company.self;
    }
}
window.customElements.define(AppscoApplicationsLabel.is, AppscoApplicationsLabel);
