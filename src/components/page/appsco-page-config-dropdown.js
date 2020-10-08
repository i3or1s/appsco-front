import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '../header/appsco-dropdown.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPageConfigDropdown extends mixinBehaviors([Appsco.HeadersMixin], DisableUpgradeMixin(PolymerElement)) {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: inline-block;
                position: relative;
                color: var(--primary-text-color);

                --paper-card-content: {
                    @apply --layout-flex-vertical;
                    padding: 10px;
                    font-size: 14px;
                };
                --paper-card-actions: {
                    padding: 6px 0;
                    border-color: #ffffff;
                    font-size: 12px;
                };
                --paper-input-container-label-focus: {
                    left: 0px;
                };
                --paper-dropdown-menu-button: {
                    background-color: white;
                };
            }

            :host h1 {
                font-weight: normal;
                font-size: 18px;
            }

            :host paper-toggle-button {
                cursor: pointer;
            }

            :host paper-dropdown-menu {
                width: 100%;

                --paper-input-container-underline: {
                    display: none;
                };
                --paper-input-container-underline-focus: {
                    display: none;
                };
                --paper-dropdown-menu-ripple: {
                    display: none;
                };
                --paper-input-container-input: {
                    vertical-align: middle;
                    cursor: pointer;
                    @apply --application-actions-paper-dropdown-menu-input;
                };
            }

            :host appsco-dropdown {
                top: 12px;
                right: -20px;

            }

            :host paper-card {
                @apply --layout-flex-vertical;
                width: 100%;
                background-color: white;
            }
            
            :host #dropDownGroupByOptions {
                margin-top: 20px;
            }
            
            .input-container-show-resource-section paper-dropdown-menu {
                width: 100%;
            }

            .input-container-show-resource-section {
                margin-top: 30px;
                margin-bottom: 10px;
            }
        </style>

        <appsco-dropdown id="pageSettingsDropdown" trigger="[[ _triggerDropdown ]]">

            <paper-card class="layout vertical">

                <div class="card-content">
                    <h1>Page settings</h1>

                    <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

                    <template is="dom-if" if="[[ optionHideResourceSection ]]">
                        <div class="input-container input-container-show-resource-section">
                            <paper-toggle-button id="hideResourceSectionToggle" name="hide_resource_section" data-field="" on-tap="_onSaveChanges" checked\$="[[ _hideResourceSection ]]">Hide [[ resourceSectionName ]] section
                            </paper-toggle-button>
                            <p class="info">
                                Resource section will not be displayed by default when this option is turned on.
                            </p>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ optionDisplayList ]]">
                        <div class="input-container">
                            <paper-dropdown-menu id="dropDownPageDisplay" name="display_style" label="Resources view" horizontal-align="left" data-field="choice">
                                <paper-listbox id="paperListboxPageDisplay" class="dropdown-content filter" attr-for-selected="value" selected="{{ _displayKind }}" slot="dropdown-content">
                                    <template is="dom-repeat" items="[[ _displayKindList ]]">
                                        <paper-item value="[[ item.value ]]" on-tap="_onSaveChanges">[[ item.name ]]</paper-item>
                                    </template>
                                </paper-listbox>
                            </paper-dropdown-menu>
                            <p class="info">
                                Choose how the resources card will be displayed on the page.
                            </p>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ optionSort ]]">
                        <div class="input-container">
                            <paper-dropdown-menu id="dropDownSortOptions" label="Sort resources by" horizontal-align="left" data-field="sort">
                                <paper-listbox id="paperListboxSortOptions" class="dropdown-content filter" attr-for-selected="value" selected="{{ _sortOption }}" slot="dropdown-content">
                                    <template is="dom-repeat" items="[[ _sortOptionList ]]">
                                        <paper-item value="[[ item.value ]]" sort-field="[[ item.sortField ]]" sort-ascending="[[ item.sortAscending ]]" on-tap="_onSaveChanges">[[ item.name ]]</paper-item>
                                    </template>
                                </paper-listbox>
                            </paper-dropdown-menu>
                        </div>
                    </template>
                    
                    <template is="dom-if" if="[[ optionShowGroupBy ]]">
                        <div class="input-container">
                            <paper-dropdown-menu id="dropDownGroupByOptions" label="Group resources by" horizontal-align="left" data-field="choice" name="group_by">
                                <paper-listbox id="paperListboxGroupByOptions" class="dropdown-content filter" attr-for-selected="value" selected="{{ _groupByOption }}" slot="dropdown-content">
                                    <template is="dom-repeat" items="[[ _groupByList ]]">
                                        <paper-item value="[[ item.value ]]" on-tap="_onSaveChanges">[[ item.name ]]</paper-item>
                                    </template>
                                </paper-listbox>
                            </paper-dropdown-menu>
                        </div>
                    </template>
                </div>
            </paper-card>
        </appsco-dropdown>
`;
    }

    static get is() { return 'appsco-page-config-dropdown'; }

    static get properties() {
        return {
            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            pageConfigApi: {
                type: String
            },

            page: {
                type: String,
                value: ''
            },

            pageConfig: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            optionHideResourceSection: {
                type: Boolean,
                value: false
            },

            optionDisplayList: {
                type: Boolean,
                value: false
            },

            optionSort: {
                type: Boolean,
                value: false
            },

            optionShowGroupBy: {
                type: Boolean,
                value: false
            },

            resourceSectionName: {
                type: String,
                computed: '_computeResourceSectionName(page)'
            },

            _groupByList: {
                type: Array,
                value: function () {
                    return [
                        {value: 'none', name: 'None'},
                        {value: 'origin', name: 'Origin'}
                    ];
                }
            },

            _displayKindList: {
                type: Array,
                value: function () {
                    return [
                        {value: 'list', name: 'List'},
                        {value: 'grid', name: 'Grid'}
                    ];
                }
            },

            _sortOptionList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: 'created0',
                            name: 'Newest to oldest',
                            sortField: 'created',
                            sortAscending: false
                        },
                        {
                            value: 'created1',
                            name: 'Oldest to newest',
                            sortField: 'created',
                            sortAscending: true
                        },
                        {
                            value: 'title1',
                            name: 'A to Z',
                            sortField: 'title',
                            sortAscending: true
                        },
                        {
                            value: 'title0',
                            name: 'Z to A',
                            sortField: 'title',
                            sortAscending: false
                        }
                    ];
                }
            },

            /**
             * DOM element which triggers the dropdown.
             */
            _triggerDropdown: {
                type: Object,
                notify: true
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _hideResourceSection: {
                type: Boolean,
                computed: '_computeHideResourceSection(pageConfig, page)'
            },

            _displayKind: {
                type: Boolean,
                computed: '_computeDisplayKind(pageConfig, page)'
            },

            _sortOption: {
                type: String,
                computed: '_computeSortOption(pageConfig, page)'
            },

            _groupByOption: {
                type: String,
                computed: '_computeGroupBy(pageConfig, page)'
            }
        };
    }

    ready() {
        super.ready();

        this._triggerDropdown = this.shadowRoot.getElementById('dropdownActions');
    }

    toggle(target) {
        this._triggerDropdown = target;
        setTimeout(() => this.$.pageSettingsDropdown.toggle());
    }

    _computeHideResourceSection(pageConfig, page) {
        return pageConfig[page] ? !!pageConfig[page].hide_resource_section : false;
    }

    _computeDisplayKind(pageConfig, page) {
        return pageConfig[page] ? pageConfig[page].display_style : 'list';
    }

    _computeSortOption(pageConfig, page) {
        return pageConfig[page] ?
            (pageConfig[page].sort_field + (pageConfig[page].sort_ascending ? 1 : 0)) :
            (this._sortOptionList ? this._sortOptionList[0].value : '');
    }

    _computeGroupBy(pageConfig, page) {
        return pageConfig[page] ? pageConfig[page].group_by : 'none';
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _saveChanges(settings) {
        const request = document.createElement('iron-request'),
            options = {
                url: this.pageConfigApi,
                method: 'PUT',
                handleAs: 'json',
                headers: this._headers
            };
        let body = 'page_config[page]=' + encodeURIComponent(this.page);

        for (const key in settings) {
            body += ('&page_config[' + key +']=' +
                (('boolean' === typeof settings[key]) ?
                    (settings[key] ? 1 : 0) :
                    encodeURIComponent(settings[key])));
        }

        options.body = body;

        request.send(options).then(function(request) {
            if (200 === request.status) {
                const pageConfig = request.response;

                this.set('pageConfig', pageConfig);
                this.dispatchEvent(new CustomEvent('page-settings-changed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        page: this.page,
                        pageConfig: pageConfig
                    }
                }));

                this._hideLoader();
            }
        }.bind(this), function() {
            this.dispatchEvent(new CustomEvent('notify-about-error', {
                bubbles: true,
                composed: true,
                detail: {
                    message: this.apiErrors.getError(request.response.code)
                }
            }));

            this._hideLoader();
        }.bind(this));
    }

    _onSaveChanges() {
        const settings = {};

        this._showLoader();

        setTimeout(function() {
            dom(this.root).querySelectorAll('[data-field]').forEach(function(field) {
                if ('choice' === field.getAttribute('data-field') && field.selectedItem) {
                    settings[field.name] = field.selectedItem.value;
                }
                else if ('sort' === field.getAttribute('data-field') && field.selectedItem) {
                    settings['sort_field'] = field.selectedItem.sortField;
                    settings['sort_ascending'] = field.selectedItem.sortAscending;
                }
                else if ('undefined' !== typeof field.checked) {
                    settings[field.name] = field.checked;
                }
                else if (field.value) {
                    settings[field.name] = field.value;
                }
            }.bind(this));
            this._saveChanges(settings);
        }.bind(this), 30);
    }

    _computeResourceSectionName(page){
        return page === 'home' ? 'filters' : 'groups';
    }
}
window.customElements.define(AppscoPageConfigDropdown.is, AppscoPageConfigDropdown);
