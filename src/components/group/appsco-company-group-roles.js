import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import './appsco-company-group-role-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyGroupRoles extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-company-group-roles;
            }
            .roles {
                @apply --layout-vertical;
                @apply --layout-start;
            }
            appsco-company-group-role-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-company-group-role-item;
            }
            .group-roles-container {
                width: 100%;
                position: relative;
            }
            appsco-loader {
                background-color: rgba(255, 255, 255, 0.4);
            }
            .load-more-box {
                margin-top: 10px;
                padding-top: 4px;
                position: relative;
            }
            .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            .progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            .roles {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                width: 100%;
            }
            .info-total {
                margin-bottom: 10px;
            }
            .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }
            paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
                @apply --text-wrap-break;
            }
            :host([preview]) .roles {
                @apply --layout-horizontal;
            }
            :host([preview]) appsco-company-group-role-item {
                width: auto;
                margin: 0 2px 0 0;
                @apply --appsco-company-group-role-item-preview;
            }
        </style>

        <div class="group-roles-container">

            <iron-ajax id="getGroupRolesApiRequest" url="[[ _listApi ]]" headers="[[ _headers ]]" debounce-duration="300" on-error="_onError" on-response="_onResponse"></iron-ajax>

            <paper-progress id="paperProgress" class="progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_rolesEmpty ]]">

                <div class="info-total">
                    <div class="total">
                        Total users: [[ _totalRoles ]]
                    </div>
                </div>

                <div class="roles" preview="[[ preview ]]">
                    <template is="dom-repeat" items="{{ _roles }}" on-dom-change="_onItemsDomChange">

                        <appsco-company-group-role-item id="appscoGroupRoleItem_[[ index ]]" group="[[ group ]]" role="{{ item }}" preview="[[ preview ]]"></appsco-company-group-role-item>

                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_rolesEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMoreRoles" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-group-roles'; }

    static get properties() {
        return {
            group: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            listApi: {
                type: String,
                observer: '_onListApiChanged'
            },

            size: {
                type: Number,
                value: 10
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            preview: {
                type: Boolean,
                value: false
            },

            /**
             * If true roles will load on listApi change.
             */
            autoLoadActive: {
                type: Boolean,
                value: false
            },

            _listApi: {
                type: String,
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _roles: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _allRoles: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _rolesEmpty: {
                type: Boolean,
                value: false
            },

            _message: {
                type: String,
                value: ''
            },

            _nextPageApiUrl: {
                type: String
            },

            _totalRoles: {
                type: Number,
                value: 0
            },

            _renderedIndex: {
                type: Number,
                value: -1
            },

            _loaders: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'cascaded-animation',
                animation: 'slide-from-left-animation',
                nodes: [],
                nodeDelay: 50,
                timing: {
                    duration: 300
                }
            }
        };
    }

    _onListApiChanged(url) {
        if (!url) {
            return;
        }
        this._listApi = ((url.indexOf('extended') !== -1) ? url : (url + '?extended=1')) + '&page=1&limit=' + this.size;
        if (this.autoLoadActive && url && url.length > 0) {
            this._loadRoles();
        }
    }

    _setLoadMoreAction() {
        this._loadMore = (!this.preview && this.loadMore && this._allRoles.length < this._totalRoles);
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    _loadRoles() {
        this._showProgressBar();
        this._loadMore = false;
        this._clearRoles();
        this.$.getGroupRolesApiRequest.generateRequest();
    }

    loadItems() {
        this._loadRoles();
    }

    reloadRoles() {
        this._loadRoles();
    }

    _loadMoreRoles() {
        this._showLoadMoreProgressBar();
        this.$.getGroupRolesApiRequest.url = this._nextPageApiUrl;
        this.$.getGroupRolesApiRequest.generateRequest();
    }

    _onError(event) {
        this._message = 'We couldn\'t load users at the moment. Please try again in a minute.';
        this._handleEmptyLoad();
    }

    _handleEmptyLoad() {
        this._rolesEmpty = true;
        this._message = 'There are no users in the group.';

        this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));

        this._hideProgressBar();
        this._hideLoadMoreProgressBar();
    }

    _clearLoaders() {
        for (const idx in this._loaders) {
            clearTimeout(this._loaders[idx]);
        }
        this.set('_loaders', []);
    }

    _clearRoles() {
        this._clearLoaders();
        this.set('_roles', []);
        this.set('_allRoles', []);
    }

    _onResponse(event) {
        const response = event.detail.response;

        if (response && response.company_roles) {
            const roles = response.company_roles,
                meta = response.meta,
                rolesCount = roles.length - 1;

            this._totalRoles = meta.total;
            this._nextPageApiUrl = meta.next + '&limit=' + this.size;

            if (meta.total === 0) {
                this._handleEmptyLoad();
                return false;
            }

            this._rolesEmpty = false;
            this._message = '';

            if (this.preview) {
                this._clearRoles();
            }
            roles.forEach(function(el, index) {
                this._loaders.push(setTimeout(function() {
                    this.push('_roles', el);
                    this.push('_allRoles', el);

                    if (index === rolesCount) {
                        this._loadMore = this.loadMore;

                        if (this._roles.length === meta.total) {
                            this._loadMore = false;
                        }

                        this._hideProgressBar();
                        this._hideLoadMoreProgressBar();
                        this._setLoadMoreAction();

                        this.dispatchEvent(new CustomEvent('group-roles-loaded', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                companyRoles: roles
                            }
                        }));
                    }
                }.bind(this), (index + 1) * 30));
            }.bind(this));
        }
    }

    addGroupItems(roles) {
        const length = roles.length,
            allRoles = this._allRoles,
            allLength = allRoles.length;

        this._rolesEmpty = false;
        this._message = '';
        this._renderedIndex = length - 1;

        for (let i = 0; i < length; i++) {
            if (0 === allLength) {
                this.push('_roles', roles[i]);
                this.push('_allRoles', roles[i]);

                this._totalRoles++;
            }
            else {
                for (let j = 0; j < allLength; j++) {
                    if (allRoles[j].alias === roles[i].alias) {
                        break;
                    }
                    else if (j === allLength - 1) {
                        this.unshift('_roles', roles[i]);
                        this.unshift('_allRoles', roles[i]);

                        this._totalRoles++;
                    }
                }
            }
        }
    }

    removeGroupItems(roles) {
        const length = roles.length,
            _roles = this._roles,
            _length = _roles.length,
            allRoles = this._allRoles,
            allLength = allRoles.length;

        for (let i = 0; i < length; i++) {
            const role = roles[i];

            for (let j = 0; j < _length; j++) {
                if (role.self === _roles[j].self) {
                    this.splice('_roles', j, 1);
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (role.self === allRoles[k].self) {
                    this.splice('_allRoles', k, 1);
                    break;
                }
            }

            this._totalRoles--;
        }

        if (0 === this._roles.length) {
            this._handleEmptyLoad();
        }
    }

    _showProgressBar() {
        this.shadowRoot.getElementById('paperProgress').hidden = false;
    }

    _showLoadMoreProgressBar() {
        this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('paperProgress').hidden = true;
        }.bind(this), 300);
    }

    _hideLoadMoreProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
        }.bind(this), 300);
    }

    _onItemsDomChange() {
        const index = this._renderedIndex;

        if (-1 !== index) {
            this.animationConfig.entry.nodes = [];

            for (let i = 0; i <= index; i++) {
                const addedItem = this.shadowRoot.getElementById('appscoGroupRoleItem_' + i);
                this.animationConfig.entry.nodes.push(addedItem);
            }

            this.playAnimation('entry');

            this._renderedIndex = -1;
        }
    }
}
window.customElements.define(AppscoCompanyGroupRoles.is, AppscoCompanyGroupRoles);
