import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '../components/appsco-search.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccessOnBoardingPageFilters extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --appsco-access-on-boarding-page-filters;

                --paper-dropdown-menu: {
                    width: 100%;
                };
            }
            paper-dropdown-menu {
                --paper-input-container: {
                    padding-bottom: 0;
                };
                --paper-input-container-input: {
                    font-size: 14px;
                    cursor: pointer;
                };
            }
            .filter {
                margin-bottom: 10px;
                position: relative;
                box-sizing: border-box;
            }
            .suggested-groups {
                @apply --shadow-elevation-2dp;
                width: 100%;
                min-height: 100px;
                max-height: calc(100vh - 2*64px - 30px - 10px - 3*54px);
                overflow-y: auto;
                position: absolute;
                top: 50px;
                left: 0;
                z-index: 10;
                opacity: 1;
                visibility: visible;
                transform: scale(1, 1);
                transform-origin: top center;
                transition: all 0.2s linear;
            }
            .suggested-groups[hidden] {
                opacity: 0;
                visibility: hidden;
                transform: scale(1, 0.6);
                transform-origin: top center;
                transition: all 0.1s linear;
            }
            paper-item {
                min-height: initial;
                padding: 8px 10px;
                line-height: 18px;
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
        </style>

        <iron-ajax auto="" method="GET" url="[[ _groupsApi ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onGroupsResponse"></iron-ajax>

        <div class="filter">
            <appsco-search id="appscoSearch" label="Search accounts" on-search="_onSearchRoles" on-search-clear="_onSearchRolesClear"></appsco-search>
        </div>

        <div id="filterGroup" class="filter">
            <appsco-search id="appscoSearchGroup" label="Filter by group" float-label="" on-focus="_onFilterGroupFocus" on-keyup="_onFilterGroupKeyup" on-search="_onFilterGroupSearch" on-search-clear="_onClearGroupSearch"></appsco-search>

            <paper-listbox id="filterListGroups" class="dropdown-content suggested-groups" on-iron-activate="_onFilterByGroupAction" hidden="">
                <template is="dom-repeat" items="{{ _groupListDisplay }}">
                    <paper-item value\$="[[ item.alias ]]" name\$="[[ item.name ]]">
                        [[ _format(item.name) ]]
                    </paper-item>
                </template>
            </paper-listbox>
        </div>
`;
    }

    static get is() { return 'appsco-access-on-boarding-page-filters'; }

    static get properties() {
        return {
            groupsApi: {
                type: String
            },

            _groupsApi: {
                type: String,
                computed: '_computeGroupsApi(groupsApi)'
            },

            _searchGroupsApi: {
                type: String,
                computed: '_computeSearchGroupsApi(groupsApi, _groupTerm)'
            },

            _groupList: {
                type: Array,
                value: function () {
                    return [{
                        alias: 'all',
                        name: 'All groups'
                    }];
                }
            },

            _groupListDisplay: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _groupTerm: {
                type: String,
                value: ''
            },

            _filterTerm: {
                type: String,
                value: ''
            },

            _filterGroup: {
                type: Object,
                value: function () {
                    return {};
                }
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            gestures.add(document, 'tap', this._handleDocumentClick.bind(this));
        });
    }

    reset() {
        this.$.appscoSearch.reset();
        this.$.filterListGroups.selected = 0;
        this._hideGroupList();
    }

    getFilters() {
        return {
            term: this._filterTerm,
            group: this._filterGroup
        };
    }

    _computeGroupsApi(groupsApi) {
        return groupsApi ? groupsApi + '?extended=1' : null;
    }

    _computeSearchGroupsApi(groupsApi, term) {
        return (groupsApi && term) ? (groupsApi + '?extended=1&limit=10&term=' + term) : null;
    }

    _isInPath(path, element) {
        path = path || [];

        for (var i = 0; i < path.length; i++) {

            if (path[i] == element) {
                return true;
            }
        }

        return false;
    }

    _handleDocumentClick(event) {
        const path = dom(event).path;

        if (!this._isInPath(path, this.$.filterGroup)) {
            this._hideGroupList();
        }
    }

    _filter() {
        this.dispatchEvent(new CustomEvent('filter-access-on-boarding', {
            bubbles: true,
            composed: true,
            detail: {
                filters: this.getFilters()
            }
        }));
    }

    _filterRolesByTermAction(term) {
        this._filterTerm = term;
        this._filter();
    }

    _onSearchRoles(event) {
        this._filterRolesByTermAction(event.detail.term);
    }

    _onSearchRolesClear() {
        this._filterRolesByTermAction('');
    }

    _onGroupsResponse(event) {
        const response = event.detail.response;

        if (response && response.company_groups) {
            response.company_groups.forEach(function(item, index) {
                this.push('_groupList', item);
            }.bind(this));

            this.set('_groupListDisplay', this._groupList);
            this._setDefaultGroup();
        }
    }

    _filterGroupListByTerm(term) {
        const termLength = term.length,
            groups = this._groupList,
            length = groups.length;

        this.set('_groupListDisplay', []);

        if (3 > termLength) {
            term = '';
        }

        for (let i = 0; i < length; i++) {
            const group = groups[i];

            if (group && group.name.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                this.push('_groupListDisplay', group);
            }

        }

        if (0 === this._groupListDisplay.length && 3 < termLength) {
            this.push('_groupListDisplay', {
                value: 'no-result',
                name: 'There is no accounts in asked group.'
            });
        }
    }

    _setDefaultGroup() {
        this.$.appscoSearchGroup.setValue(this._groupList[0].name);
        this.$.filterListGroups.selected = 0;
    }

    _showGroupList() {
        this.$.filterListGroups.hidden = false;
    }

    _hideGroupList() {
        const groupFilter = this.$.filterListGroups,
            appscoGroupSearch = this.$.appscoSearchGroup,
            value = appscoGroupSearch.getValue() || '';

        if (0 === value.length && groupFilter.selectedItem) {
            appscoGroupSearch.setValue(groupFilter.selectedItem.name);
        }

        this.$.filterListGroups.hidden = true;
    }

    _onFilterGroupFocus() {
        this._showGroupList();
    }

    _onFilterGroupKeyup(event) {
        var keyCode = event.keyCode;

        if (40 === keyCode) {
            event.target.blur();
            this._selectFirstGroup();
        }
    }

    _onFilterGroupSearch(event) {
        this._filterGroupListByTerm(event.detail.term);
    }

    _onClearGroupSearch(event) {
        this._filterGroupListByTerm('');
    }

    _selectFirstGroup() {
        const groupFilter = this.$.filterListGroups;

        if (!groupFilter.selectedItem) {
            groupFilter.selected = this._groupListDisplay[0].value;
        }

        groupFilter.selectedItem.focus();
    }

    _onFilterByGroupAction(event) {
        var alias = event.detail.item.getAttribute('value'),
            groups = this._groupListDisplay,
            length = groups.length,
            selectedGroup;

        if ('all' === alias) {
            selectedGroup = {
                alias: 'all',
                name: event.detail.item.getAttribute('name')
            };
        }
        else {
            for (let i = 0; i < length; i++) {
                if (alias === groups[i].alias) {
                    selectedGroup = groups[i];
                    break;
                }
            }

            selectedGroup.activated = true;
        }

        this.set('_filterGroup', selectedGroup);
        this.$.appscoSearchGroup.setValue(this._format(selectedGroup.name));
        this._hideGroupList();

        this._filter();
    }

    _format(value) {
        let result = '';

        if (value) {
            result = value;

            if (value.length > 40) {
                result = value.substring(0, 40) + '...';
            }
        }

        return result;
    }
}
window.customElements.define(AppscoAccessOnBoardingPageFilters.is, AppscoAccessOnBoardingPageFilters);
