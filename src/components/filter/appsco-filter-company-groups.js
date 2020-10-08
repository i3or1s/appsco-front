import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '../group/appsco-company-groups';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoFilterCompanyGroups extends mixinBehaviors([
    Appsco.HeadersMixin
], DisableUpgradeMixin(PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host .node > span {
                padding: 0.3rem;
                margin-left: -0.2rem;
            }            
            :host .layout-horizontal {
                @apply --layout-horizontal;
                padding-left: 0.2rem;
            }
            :host .node-icon {
                padding-top: 0.2rem;
                cursor: pointer;
            }
            :host .toggle-icon {
                transition: transform 0.2s linear;
                cursor: pointer;
            }
            :host .toggle-icon[opened] {
                transform: rotate(-180deg);
                transition: transform 0.3s linear;
            }
            :host [activated] {
                background-color: #e8e8e8;
            }
            :host appsco-company-groups {
                margin-bottom: 1.2rem;
                padding-left: 2.5rem;
                padding-right: 10px;
                --list-container: {
                    min-height: inherit;
                    padding-top: 0;
                }
                --group-item-preview-font-size: 13px;
                --info-message: {
                     @apply --paper-font-body1;
                     color: var(--primary-text-color);
                     font-style: normal;
                     font-size: 13px;
                     margin-top: 0.3rem;
                 };
                 --appsco-company-group-item: {
                    padding: 5px;
                    margin: 0;
                };
            }            
            :host .node span[filter] {
                font-size: 14px;
                user-select: none;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                width: calc(100% - 1rem);
                cursor: pointer;
            }
            :host .node span[filter][activated] {
                font-weight: 500;
            }
            :host iron-collapse {
                --iron-collapse-transition-duration: 0.4s;
            }
        </style>
        <div class="layout-horizontal node">
            <div class="node-icon" on-tap="_toggle">
                <iron-icon icon="icons:expand-less" class="toggle-icon" opened\$="[[ opened ]]"></iron-icon>
            </div>                            
            <span
                filter\$="[[ company.company_uuid ]]"
                company="[[ company ]]"
                activated\$="[[ companySelected ]]"
                on-tap="_onCompanyTapped">
                [[ company.name ]]
            </span>            
        </div>
        <iron-collapse id="ironCollapse">
            <appsco-company-groups
                id="appscoCompanyGroups"
                list-api="[[ groupsApi ]]"
                authorization-token="[[ authorizationToken ]]"
                size="[[ groupSize ]]"
                type="group"
                preview=""
                on-item="_onGroupSelected">
            </appsco-company-groups>
        </iron-collapse>`;
    }

    static get is() { return 'appsco-filter-company-groups'; }

    static get properties() {
        return {
            company: {
                type: Object
            },

            groupsApi: {
                type: String
            },

            companySelected: {
                type: Boolean,
                value: false
            },

            groupSize: {
                type: Number,
                value: 10
            },

            opened: {
                type: Boolean,
                observer: '_onOpenedChanged'
            }
        };
    }

    _onCompanyTapped(){
        this.companySelected = !this.companySelected;

        this.resetGroups();

        const eventName = this.companySelected ? 'company-selected' : 'company-deselected';

        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: {
                company: this.company
            }
        }));
    }

    reset() {
        this.companySelected = false;
        this.resetGroups();
    }

    resetGroups() {
        this.$.appscoCompanyGroups.resetAllItems();
    }

    isForCompany(company) {
        return company.company_uuid === this.company.company_uuid;
    }

    isForGroup(group) {
        return group.company === this.company.self;
    }

    _onGroupSelected() {
        this.companySelected = false;
    }

    _onOpenedChanged(opened) {
        opened ?
            this.$.ironCollapse.show() :
            this.$.ironCollapse.hide()
        ;
    }

    _toggle() {
        this.opened = !this.opened;
    }
}
window.customElements.define(AppscoFilterCompanyGroups.is, AppscoFilterCompanyGroups);
