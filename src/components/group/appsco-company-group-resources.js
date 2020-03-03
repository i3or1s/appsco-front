import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import './appsco-company-group-resource-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyGroupResources extends mixinBehaviors([
    Appsco.HeadersMixin,
    NeonAnimationRunnerBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-company-group-resources;
            }
            .resources {
                @apply --layout-vertical;
                @apply --layout-start;
            }
            appsco-company-group-resource-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-company-group-resource-item;
            }
            .group-resources-container {
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
            paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            .info-total {
                margin-bottom: 10px;
            }
            .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }
            .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host([preview]) .resources {
                @apply --layout-horizontal;
            }
            :host([preview]) appsco-company-group-resource-item {
                width: auto;
                margin: 0 2px 0 0;
                @apply --appsco-company-group-resource-item-preview;
            }
        </style>

        <div class="group-resources-container">

            <iron-ajax id="getGroupResourcesApiRequest" url="[[ _listApi ]]" headers="[[ _headers ]]" debounce-duration="300" on-error="_onError" on-response="_onResponse"></iron-ajax>

            <paper-progress id="paperProgress" class="progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_resourcesEmpty ]]">

                <div class="info-total">
                    <div class="total">
                        Total resources: [[ _totalResources ]]
                    </div>
                </div>

                <div class="resources">
                    <template is="dom-repeat" items="{{ _resources }}" on-dom-change="_onItemsDomChange">

                        <appsco-company-group-resource-item id="appscoGroupResourceItem_[[ index ]]" resource="{{ item }}" group="[[ group ]]" preview="[[ preview ]]"></appsco-company-group-resource-item>

                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_resourcesEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMoreResources" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-group-resources'; }

    static get properties() {
        return {
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

            group: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _resources: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _allResources: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _resourcesEmpty: {
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

            _totalResources: {
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
        if (url && url.length > 0) {
            this._loadResources();
        }
    }

    _setLoadMoreAction() {
        this._loadMore = (!this.preview && this.loadMore && this._allResources.length < this._totalResources);
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    loadItems() {
        this._loadResources();
    }

    _loadResources() {
        this._showProgressBar();
        this._loadMore = false;
        this._clearResources();
        this.$.getGroupResourcesApiRequest.generateRequest();
    }

    reloadResources() {
        this._loadResources();
    }

    _loadMoreResources() {
        this._showLoadMoreProgressBar();
        this.$.getGroupResourcesApiRequest.url = this._nextPageApiUrl;
        this.$.getGroupResourcesApiRequest.generateRequest();
    }

    _onError() {
        this._message = 'We couldn\'t load resources at the moment. Please try again in a minute.';
        this._handleEmptyLoad();
    }

    _handleEmptyLoad() {
        this._resourcesEmpty = true;
        this._message = 'There are no resources attached to this group.';

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

    _clearResources() {
        this._clearLoaders();
        this.set('_resources', []);
        this.set('_allResources', []);
    }

    _onResponse(event) {
        const response = event.detail.response;

        if (response && response.applications) {
            const resources = response.applications,
                meta = response.meta,
                resourcesCount = resources.length - 1;

            this._totalResources = meta.total;
            this._nextPageApiUrl = meta.next + "&limit=" + this.size;

            if (meta.total === 0) {
                this._handleEmptyLoad();
                return false;
            }

            this._resourcesEmpty = false;
            this._message = '';

            if (this.preview) {
                this._clearResources();
            }
            resources.forEach(function(el, index) {
                this._loaders.push(setTimeout(function() {
                    this.push('_resources', el);
                    this.push('_allResources', el);

                    if (index === resourcesCount) {

                        this._loadMore = this.loadMore;

                        if (this._resources.length === meta.total) {
                            this._loadMore = false;
                        }

                        this._hideProgressBar();
                        this._hideLoadMoreProgressBar();
                        this._setLoadMoreAction();

                        this.dispatchEvent(new CustomEvent('loaded', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                companyResources: resources
                            }
                        }));
                    }
                }.bind(this), (index + 1) * 30));
            }.bind(this));
        }
    }

    addGroupItems(resources) {
        const length = resources.length,
            allResources = this._allResources,
            allLength = allResources.length;

        this._resourcesEmpty = false;
        this._message = '';
        this._renderedIndex = length - 1;

        for (let i = 0; i < length; i++) {
            if (0 === allLength) {
                this.push('_resources', resources[i]);
                this.push('_allResources', resources[i]);

                this._totalResources++;
            }
            else {
                for (let j = 0; j < allLength; j++) {
                    if (allResources[j].alias === resources[i].alias) {
                        break;
                    }
                    else if (j === allLength - 1) {
                        this.unshift('_resources', resources[i]);
                        this.unshift('_allResources', resources[i]);

                        this._totalResources++;
                    }
                }
            }
        }
    }

    removeGroupItems(resources) {
        const length = resources.length,
            _resources = this._resources,
            _length = _resources.length,
            allResources = this._allResources,
            allLength = allResources.length;

        for (let i = 0; i < length; i++) {
            const resource = resources[i];

            for (var j = 0; j < _length; j++) {
                if (resource.application.self === _resources[j].self) {
                    this.splice('_resources', j, 1);
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (resource.application.self === allResources[k].self) {
                    this.splice('_allResources', k, 1);
                    break;
                }
            }

            this._totalResources--;
        }

        if (0 === this._resources.length) {
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
                const addedItem = this.shadowRoot.getElementById('appscoGroupResourceItem_' + i);
                this.animationConfig.entry.nodes.push(addedItem);
            }

            this.playAnimation('entry');

            this._renderedIndex = -1;
        }
    }
}
window.customElements.define(AppscoCompanyGroupResources.is, AppscoCompanyGroupResources);
