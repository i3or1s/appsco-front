import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import './appsco-invitation-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoInvitations extends mixinBehaviors([
    Appsco.HeadersMixin,
    NeonAnimationRunnerBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                color: var(--primary-text-color);
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-invitations;
            }

            :host .invitations {
                @apply --layout-vertical;
                @apply --layout-start;
                @apply --appsco-invitations;
            }
            :host appsco-invitation-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-invitation-item;
            }
            :host .invitations-container {
                width: 100%;
                position: relative;
            }
            :host appsco-loader {
                background-color: rgba(255, 255, 255, 0.4);
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
            :host .invitations-progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --invitations-progress-bar;
            }
            :host paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host .invitations-empty-message {
                @apply --invitations-empty-message;
            }
        </style>

        <div class="invitations-container">

            <iron-ajax id="getInvitationsApiRequest" url="[[ _invitationsApiUrl ]]" on-error="_onError" on-response="_onResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

            <paper-progress id="paperProgress" class="invitations-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_invitationsEmpty ]]">
                <div class="invitations">
                    <template is="dom-repeat" items="{{ _invitations }}" on-dom-change="_onItemsDomChange">

                        <appsco-invitation-item id="appscoInvitationItem_[[ index ]]" invitation="{{ item }}" authorization-token="[[ authorizationToken ]]"></appsco-invitation-item>

                    </template>
                </div>
            </template>

            <template is="dom-if" if="[[ _invitationsEmpty ]]">
                <p class="message invitations-empty-message">There are no invitations.</p>
            </template>
        </div>

        <template is="dom-if" if="[[ !_invitationsEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMoreInvitations" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-invitations'; }

    static get properties() {
        return {
            invitationsApi: {
                type: String
            },

            size: {
                type: Number,
                value: 10
            },

            /**
             * Type of invitation
             */
            type: {
                type: String,
                value: function () {
                    return 'user';
                }
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _invitations: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _allInvitations: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _invitationsEmpty: {
                type: Boolean,
                value: false
            },

            _message: {
                type: String,
                value: ''
            },

            _invitationsApiUrl: {
                type: String,
                computed: '_computeInvitationsApiUrl(invitationsApi, size, type)',
                observer: '_onInvitationsApiUrlChanged'
            },

            _searchInvitationsApiUrl: {
                type: String,
                computed: '_computeSearchInvitationsApiUrl(invitationsApi, type, _filterTerm)'
            },

            _next: {
                type: String
            },

            _totalInvitations: {
                type: Number,
                value: 0
            },

            _renderedIndex: {
                type: Number,
                value: -1
            },

            _filterTerm: {
                type: String,
                value: ''
            },

            _searchedInvitations: {
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

    static get observers() {
        return [
            '_observeItems(_invitations)',
        ];
    }

    _observeItems(items) {
        this.setObservableType('invitations');
        this.populateItems(items);
    }

    _computeInvitationsApiUrl(invitationsApi, size, type) {
        return (invitationsApi && size) ? (invitationsApi + '?page=1&extended=1&limit=' + size + '&type=' + type) : null;
    }

    _computeSearchInvitationsApiUrl(invitationsApi, type, term) {
        return (invitationsApi && term) ? (invitationsApi + '?page=1&extended=1&limit=100&type=' + type + '&term=' + term) : null;
    }

    _onInvitationsApiUrlChanged(url) {
        if (url && url.length > 0) {
            this._loadInvitations();
        }
    }

    _loadInvitations () {
        this._showProgressBar();
        this._loadMore = false;
        this.set('_invitations', []);
        this.set('_allInvitations', []);
        this.$.getInvitationsApiRequest.generateRequest();
    }

    _loadMoreInvitations () {
        this._showLoadMoreProgressBar();
        this.$.getInvitationsApiRequest.url = this._next;
        this.$.getInvitationsApiRequest.generateRequest();
    }

    _onError() {
        this._showMessage('We couldn\'t load invitations at the moment. Please contact AppsCo support.');
        this._handleEmptyLoad();
    }

    _handleEmptyLoad() {
        this._invitationsEmpty = true;

        this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));

        this._hideProgressBar();
        this._hideLoadMoreProgressBar();
    }

    _onResponse(event) {
        const response = event.detail.response,
            invitations = response.invitations,
            meta = response.meta,
            invitationsCount = invitations.length - 1;

        this._totalInvitations = meta.total;
        this._next = meta.next + "&limit=" + this.size;

        if (meta.total === 0) {
            this._handleEmptyLoad();
            return false;
        }

        this._invitationsEmpty = false;
        this._hideMessage();

        invitations.forEach(function(el, index) {
            setTimeout( function() {
                this.push('_invitations', el);
                this._invitations = JSON.parse(JSON.stringify(this._invitations));
                this.push('_allInvitations', el);

                if (index === invitationsCount) {
                    this._loadMore = this.loadMore;

                    if (this._invitations.length === meta.total) {
                        this._loadMore = false;
                    }

                    this._hideProgressBar();
                    this._hideLoadMoreProgressBar();
                    this._setLoadMoreAction();

                    this.dispatchEvent(new CustomEvent('loaded', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            invitations: invitations
                        }
                    }));
                }
            }.bind(this), (index + 1) * 30 );
        }.bind(this));
    }

    _setLoadMoreAction() {
        if (this.loadMore && this._allInvitations.length < this._totalInvitations) {
            this._loadMore = true;
        }
        else {
            this._loadMore = false;
        }
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    reset() {
        this._hideMessage();
        this._invitationsEmpty = this._allInvitations.length === 0;
        this.set('_invitations', JSON.parse(JSON.stringify(this._allInvitations)));
        this.set('_searchedInvitations', []);
        this._filterTerm = '';
    }

    addInvitations(invitations) {
        const length = invitations.length;

        this._hideMessage();
        this._invitationsEmpty = false;
        this._renderedIndex = length - 1;

        for (let i = 0; i < length; i++) {
            this.unshift('_invitations', invitations[i]);
            this._invitations = JSON.parse(JSON.stringify(this._invitations));
            this.unshift('_allInvitations', invitations[i]);

            this._totalInvitations++;
        }
    }

    modifyInvitations(invitations) {
        const _invitations = JSON.parse(JSON.stringify(this._invitations)),
            _length = _invitations.length,
            allInvitations = JSON.parse(JSON.stringify(this._allInvitations)),
            allLength = allInvitations.length,
            lengthModify = invitations.length;

        for (let i = 0; i < lengthModify; i++) {
            const invitation = invitations[i];

            for (let j = 0; j < _length; j++) {
                if (invitation.self === _invitations[j].self) {
                    _invitations[j] = invitation;
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (invitation.self === allInvitations[k].self) {
                    allInvitations[k] = invitation;
                    break;
                }
            }
        }

        this.set('_invitations', []);
        this.set('_invitations', _invitations);

        this.set('_allInvitations', []);
        this.set('_allInvitations', allInvitations);
    }

    reloadInvitations() {
        this._loadInvitations();
    }

    filterInvitations() {
        (this._filterTerm && 3 <= this._filterTerm.length) ? this._filterByTerm() : this._loadInvitations();
    }

    removeInvitations(invitations) {
        const length = invitations.length,
            _invitations = this._invitations,
            _length = _invitations.length,
            allInvitations = this._allInvitations,
            allLength = allInvitations.length;

        for (let i = 0; i < length; i++) {
            const invitation = invitations[i];

            for (let j = 0; j < _length; j++) {
                if (invitation.self === _invitations[j].self) {
                    this.splice('_invitations', j, 1);
                    this._invitations = JSON.parse(JSON.stringify(this._invitations));
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (invitation.self === allInvitations[k].self) {
                    this.splice('_allInvitations', k, 1);
                    break;
                }
            }
            this._totalInvitations--;
        }

        if (0 === this._invitations.length) {
            this._handleEmptyLoad();
        }
    }

    getTotalCount() {
        return this._totalInvitations;
    }

    _searchInvitations() {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: this._searchInvitationsApiUrl,
                    method: 'GET',
                    handleAs: 'json',
                    headers: this._headers
                };

            request.send(options).then(function() {
                if (request.response) {
                    resolve(request.response.invitations);
                }

            }, function() {
                if (request.response) {
                    reject(request.response.message);
                }
                else {
                    reject('There was an error in searching invitations with given term. Please contact AppsCo support.');
                }
            });
        }.bind(this));
    }

    _showProgressBar() {
        this.shadowRoot.getElementById('paperProgress').hidden = false;
    }

    _showLoadMoreProgressBar() {
        if (this.shadowRoot.getElementById('loadMoreProgress')) {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
        }
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('paperProgress').hidden = true;
        }.bind(this), 300);

    }

    _hideLoadMoreProgressBar() {
        setTimeout(function() {
            if (this.shadowRoot.getElementById('loadMoreProgress')) {
                this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
            }
        }.bind(this), 300);
    }

    _onItemsDomChange() {
        const index = this._renderedIndex;

        if (-1 !== index) {
            this.animationConfig.entry.nodes = [];

            for (let i = 0; i <= index; i++) {
                const addedItem = this.shadowRoot.getElementById('appscoInvitationItem_' + i);
                this.animationConfig.entry.nodes.push(addedItem);
            }

            this.playAnimation('entry');

            this._renderedIndex = -1;
        }
    }

    filterByTerm(term) {
        this._filterTerm = term;
        this._filterByTerm();
    }

    _filterByTerm() {
        const term = this._filterTerm,
            length = this._allInvitations.length;

        if (term.length < 3) {
            this.set('_searchedInvitations', []);

            this._invitationsEmpty = false;
            this._hideMessage();
            this.set('_invitations', JSON.parse(JSON.stringify(this._allInvitations)));
            this._setLoadMoreAction();

            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            return false;
        }

        this._showProgressBar();
        this._hideLoadMoreAction();

        this._searchInvitations().then(function(invitations) {
            const invitationsLength = invitations.length;

            this.set('_searchedInvitations', invitations);
            this._setSearchInvitationsResult();

            if (this._invitationsEmpty) {
                this.set('_searchedInvitations', []);
                this.set('_invitations', []);
                this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                return false;
            }

            this.set('_invitations', []);

            invitations.forEach(function(elem, index) {
                for (let i = 0; i < length; i++) {
                    const invitation = this._allInvitations[i];
                    if (elem.self === invitation.self) {
                        this.push('_invitations', invitation);
                        this._invitations = JSON.parse(JSON.stringify(this._invitations));
                        break;
                    }
                    else {
                        if (i === length - 1) {
                            this.push('_invitations', elem);
                            this._invitations = JSON.parse(JSON.stringify(this._invitations));
                        }
                    }
                }

                if (index === invitationsLength - 1) {
                    this._hideProgressBar();
                    this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                }
            }.bind(this));
        }.bind(this));
    }

    _setSearchInvitationsResult() {
        this._invitationsEmpty = (0 === this._searchedInvitations.length);

        if (this._invitationsEmpty) {
            this._showMessage('There are no invitations with asked term.');
        }
        else {
            this.set('_invitations', this._searchedInvitations);
            this._hideLoadMoreAction();
            this._hideMessage();
        }
    }
}
window.customElements.define(AppscoInvitations.is, AppscoInvitations);
