import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import './appsco-application-assignee.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAssignees extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --layout-center;
                position: relative;
                color: var(--primary-text-color);
            }
            :host .progress {
                height: 6px;
            }
            :host paper-progress {
                width: 100%;
                @apply --appsco-list-progress-bar;
            }
            :host .info-total {
                margin-bottom: 10px;
            }
            :host .total {
                @apply --paper-font-caption;
                opacity: 0.6;
            }
            :host .assignees {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                width: 100%;
            }
            :host .load-more-box {
                margin-top: 10px;
                padding-top: 4px;
                position: relative;
            }
            :host .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            :host .load-more-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            :host .message {
                width: 100%;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host appsco-application-assignee {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-application-assignee;
            }
            :host([preview]) {
                @apply --layout-flex-none;
                display: block;
            }
            :host([preview]) appsco-application-assignee {
                width: auto;
                margin: 0 2px 0 0;
                @apply --appsco-application-assignee-preview;
            }
        </style>

        <iron-ajax id="getAssigneesCall" url="[[ _listApi ]]" headers="[[ _headers ]]" method="GET" handle-as="json" on-response="_onResponse" on-error="_onError">
        </iron-ajax>

        <div class="assignees">
            <div class="progress">
                <paper-progress id="progress" indeterminate=""></paper-progress>
            </div>

            <template is="dom-if" if="[[ !preview ]]">
                <div class="info-total" hidden\$="[[ !_totalAssignees ]]">
                    <span class="total">Total assignees: [[ _totalAssignees ]]</span>
                </div>
            </template>

            <template is="dom-repeat" items="[[ _assignees ]]">
                <appsco-application-assignee application="[[ application ]]" assignee="[[ item ]]" preview="[[ preview ]]"></appsco-application-assignee>
            </template>
        </div>

        <template is="dom-if" if="[[ preview ]]">
            <div hidden\$="[[ !_totalAssignees ]]">
                <span class="total">Total assignees: [[ _totalAssignees ]]</span>
            </div>
        </template>

        <template is="dom-if" if="[[ loadMore ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button class="load-more-button" on-tap="_onLoadMoreAction">Load More</paper-button>
            </div>
        </template>

        <template is="dom-if" if="{{ _message }}">
            <p class="message">
                [[ _message ]]
            </p>
        </template>
`;
    }

    static get is() { return 'appsco-application-assignees'; }

    static get properties() {
        return {
            /**
             * [Application](https://developers.appsco.com/api/dashboard/id/icons/id)
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            /**
             * Number of assignees to load.
             */
            size: {
                type: Number,
                value: 5
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Indicates if assignees should be loaded on API change or manually by calling 'load' method.
             */
            autoLoad: {
                type: Boolean,
                value: false
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _listApi: {
                type: String,
                computed: '_computeListApi(application, size)'
            },

            _searchListApi: {
                type: String,
                computed: '_computeSearchListApi(application)'
            },

            _nextListPageApiUrl: {
                type: String
            },

            /**
             * [Accounts](https://developers.appsco.com/api/accounts/id) that is to be rendered.
             */
            _assignees: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _allAssignees: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _totalAssignees: {
                type: Number,
                value: 0
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _message: {
                type: String,
                value: ''
            }
        };
    }

    static get observers() {
        return [
            '_onListApiChanged(_listApi, autoLoad)'
        ];
    }

    load() {
        this._clearList();
        this._hideMessage();
        this._showProgressBar();
        this._generateNewRequest();
    }

    reload() {
        this.load();
    }

    removeAssignee(assignee) {
        const assignees = this._assignees,
            length = assignees.length,
            allAssignees = this._allAssignees,
            allLength = allAssignees.length;

        for (let i = 0; i < length; i++) {
            if (assignee.self === assignees[i].self) {
                this.splice('_assignees', i, 1);
                break;
            }
        }

        for (let j = 0; j < allLength; j++) {
            if (assignee.self === allAssignees[j].self) {
                this.splice('_allAssignees', j, 1);
                break;
            }
        }

        this._totalAssignees--;
        this._setLoadMoreAction();

        if (0 === this._assignees.length) {
            this._showMessage('You haven\'t shared this resource to anyone yet.');
            this._handleEmptyLoad();
        }
    }

    search(term) {
        if (term.length < 3) {
            this._hideMessage();
            this.set('_assignees', JSON.parse(JSON.stringify(this._allAssignees)));
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            this._setLoadMoreAction();
            return false;
        }

        this.set('_assignees', []);
        this._hideMessage();
        this._hideLoadMoreAction();

        this._searchAssignees(term).then(function(assignees) {
            const length = assignees.length;

            if (length > 0) {
                assignees.forEach(function(assignee, index) {
                    this.push('_assignees', assignee);

                    if (index === (length - 1)) {
                        this._hideProgressBar();
                        this.dispatchEvent(new CustomEvent('assignees-loaded', { bubbles: true, composed: true }));
                    }
                }.bind(this));
            }
            else {
                this._showMessage('There are no assignees with asked term.');
                this.dispatchEvent(new CustomEvent('assignees-empty', { bubbles: true, composed: true }));
            }
        }.bind(this), function(message) {
            this._showMessage(message);
        }.bind(this));
    }

    _computeListApi(application, size) {
        for (let key in application) {
            return (application.meta && size) ? application.meta.subscribers + '?page=1' + '&limit=' + this.size + '&extended=1' : null;
        }

        return null;
    }

    _computeSearchListApi(application) {
        for (let key in application) {
            return application.meta ? application.meta.subscribers + '?page=1&limit=100&extended=1' : null;
        }

        return null;
    }

    _clearList() {
        this.set('_assignees', []);
        this.set('_allAssignees', []);
        this._nextListPageApiUrl = null;
        this._totalAssignees = 0;
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _showProgressBar() {
        this.$.progress.hidden = false;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.$.progress.hidden = true;
        }.bind(this), 500);
    }

    _showLoadMoreAction() {
        this._loadMore = true;
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    _showLoadMoreProgressBar() {
        this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
    }

    _hideLoadMoreProgressBar() {
        setTimeout(function() {
            if (this.shadowRoot.getElementById('loadMoreProgress')) {
                this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
            }
        }.bind(this), 300);
    }

    _setLoadMoreAction() {
        (this.loadMore && this._allAssignees.length < this._totalAssignees) ?
            this._showLoadMoreAction() :
            this._hideLoadMoreAction();
    }

    _setListApiRequestUrl(url) {
        this.$.getAssigneesCall.url = url;
    }

    _handleEmptyLoad() {
        this._hideProgressBar();
        this._hideLoadMoreProgressBar();
        this.dispatchEvent(new CustomEvent('assignees-empty', { bubbles: true, composed: true }));
    }

    /**
     * Aborts previous request in order to get only one and valid response (from next request)
     *
     * @private
     */
    _abortPreviousRequest() {
        const assigneesCall = this.$.getAssigneesCall;
        if (assigneesCall.lastRequest) {
            assigneesCall.lastRequest.abort();
        }
    }

    _generateNewRequest() {
        this._abortPreviousRequest();
        this.$.getAssigneesCall.generateRequest();
    }

    _onLoadMoreAction() {
        this._showLoadMoreProgressBar();
        this._setListApiRequestUrl(this._nextListPageApiUrl);
        this._generateNewRequest();
    }

    _onError(event) {
        if (!event.detail.request.aborted) {
            this._showMessage(this.apiErrors.getError(event.detail.request.response.code));
        }

        this._totalAssignees = 0;
        this._handleEmptyLoad();
    }

    _onResponse(event) {
        const response = event.detail.response;

        if (response && response.accounts) {
            const assignees = response.accounts,
                meta = response.meta;

            this._hideMessage();

            this._totalAssignees = meta.total;
            this._nextListPageApiUrl = meta.next + '&limit=' + this.size;

            if (0 === meta.total) {
                this._showMessage('You haven\'t shared this resource to anyone yet.');
                this._handleEmptyLoad();
                return false;
            }

            if (assignees && assignees.length > 0) {
                const assigneesCount = assignees.length - 1;

                assignees.forEach(function(el, index) {
                    setTimeout( function() {
                        this.push('_assignees', el);
                        this.push('_allAssignees', el);

                        if (index === assigneesCount) {
                            this._hideProgressBar();
                            this._hideLoadMoreProgressBar();
                            this._setLoadMoreAction();

                            this.dispatchEvent(new CustomEvent('assignees-loaded', {
                                bubbles: true,
                                composed: true,
                                detail: {
                                    assignees: assignees
                                }
                            }));
                        }
                    }.bind(this), (index + 1) * 30 );
                }.bind(this));
            }
            else {
                (assignees && !assignees.length) ?
                    this._showMessage('You haven\'t shared this resource to anyone yet.') :
                    this._showMessage('We couldn\'t load assignees at the moment. Please contact AppsCo support.');

                this._hideLoadMoreAction();
                this._handleEmptyLoad();
            }
        }
    }

    _onListApiChanged(api, auto) {
        if (api && auto) {
            this.load();
        }
    }

    _searchAssignees(term) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: this._searchListApi + '&term=' + term,
                    method: 'GET',
                    handleAs: 'json',
                    headers: this._headers
                };

            request.send(options).then(function() {
                if (200 === request.status) {
                    resolve(request.response.accounts);
                }
            }, function() {
                reject(this.apiErrors.getError(request.response.code));
            });
        }.bind(this));
    }
}
window.customElements.define(AppscoApplicationAssignees.is, AppscoApplicationAssignees);
