import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import './appsco-company-group-contact-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyGroupContacts extends mixinBehaviors([NeonAnimationRunnerBehavior, Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-company-group-contacts;
            }
            .contacts {
                @apply --layout-vertical;
                @apply --layout-start;
            }
            appsco-company-group-contact-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-company-group-contact-item;
            }
            .group-contacts-container {
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
            .contacts {
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
            }
            :host([preview]) .contacts {
                @apply --layout-flex-none;
            }
            :host([preview]) appsco-company-group-contact-item {
                width: auto;
                margin: 0 2px 0 0;
                @apply --appsco-company-group-contact-item-preview;
            }
        </style>

        <div class="group-contacts-container">

            <iron-ajax id="getGroupContactsApiRequest" url="[[ _listApi ]]" headers="[[ _headers ]]" debounce-duration="300" on-error="_onError" on-response="_onResponse"></iron-ajax>

            <paper-progress id="paperProgress" class="progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_contactsEmpty ]]">

                <div class="info-total">
                    <div class="total">
                        Total contacts: [[ _totalContacts ]]
                    </div>
                </div>

                <div class="contacts">
                    <template is="dom-repeat" items="{{ _contacts }}" on-dom-change="_onItemsDomChange">

                        <appsco-company-group-contact-item id="appscoGroupContactItem_[[ index ]]" contact="{{ item }}" group="[[ group ]]" preview="[[ preview ]]"></appsco-company-group-contact-item>

                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_contactsEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMoreContacts" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-group-contacts'; }

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

            _contacts: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _allContacts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _contactsEmpty: {
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

            _totalContacts: {
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
            this._loadContacts();
        }
    }

    _setLoadMoreAction() {
        this._loadMore = (!this.preview && this.loadMore && this._allContacts.length < this._totalContacts);
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    loadItems() {
        this._loadContacts();
    }

    _loadContacts() {
        this._showProgressBar();
        this._loadMore = false;
        this._clearContacts();
        this.$.getGroupContactsApiRequest.generateRequest();
    }

    reloadContacts() {
        this._loadContacts();
    }

    _loadMoreContacts() {
        this._showLoadMoreProgressBar();
        this.$.getGroupContactsApiRequest.url = this._nextPageApiUrl;
        this.$.getGroupContactsApiRequest.generateRequest();
    }

    _onError() {
        this._message = 'We couldn\'t load contacts at the moment. Please try again in a minute.';
        this._handleEmptyLoad();
    }

    _handleEmptyLoad() {
        this._contactsEmpty = true;
        this._message = 'There are no contacts attached to this group.';

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

    _clearContacts() {
        this._clearLoaders();
        this.set('_contacts', []);
        this.set('_allContacts', []);
    }

    _onResponse(event) {
        const response = event.detail.response;
        if (response && response.contacts) {
            const contacts = response.contacts,
                meta = response.meta,
                contactsCount = contacts.length - 1;

            this._totalContacts = meta.total;
            this._nextPageApiUrl = meta.next + "&limit=" + this.size;

            if (meta.total === 0) {
                this._handleEmptyLoad();
                return false;
            }

            this._contactsEmpty = false;
            this._message = '';

            if (this.preview) {
                this._clearContacts();
            }
            contacts.forEach(function(el, index) {
                this._loaders.push(setTimeout(function() {
                    this.push('_contacts', el);
                    this.push('_allContacts', el);

                    if (index === contactsCount) {
                        this._loadMore = this.loadMore;

                        if (this._contacts.length === meta.total) {
                            this._loadMore = false;
                        }

                        this._hideProgressBar();
                        this._hideLoadMoreProgressBar();
                        this._setLoadMoreAction();

                        this.dispatchEvent(new CustomEvent('loaded', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                companyContacts: contacts
                            }
                        }));
                    }
                }.bind(this), (index + 1) * 30));
            }.bind(this));
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
                const addedItem = this.shadowRoot.getElementById('appscoGroupContactItem_' + i);
                this.animationConfig.entry.nodes.push(addedItem);
            }

            this.playAnimation('entry');

            this._renderedIndex = -1;
        }
    }

    addGroupItems(contacts) {
        const length = contacts.length,
            allContacts = this._allContacts,
            allLength = allContacts.length;

        this._contactsEmpty = false;
        this._message = '';
        this._renderedIndex = length - 1;

        for (let i = 0; i < length; i++) {
            if (0 === allLength) {
                this.push('_contacts', contacts[i]);
                this.push('_allContacts', contacts[i]);

                this._totalContacts++;
            }
            else {
                for (let j = 0; j < allLength; j++) {
                    if (allContacts[j].alias === contacts[i].alias) {
                        break;
                    }
                    else if (j === allLength - 1) {
                        this.unshift('_contacts', contacts[i]);
                        this.unshift('_allContacts', contacts[i]);

                        this._totalContacts++;
                    }
                }
            }
        }
    }

    removeGroupItems(contacts) {
        const length = contacts.length,
            _contacts = this._contacts,
            _length = _contacts.length,
            allContacts = this._allContacts,
            allLength = allContacts.length;

        for (let i = 0; i < length; i++) {
            const contact = contacts[i];

            for (let j = 0; j < _length; j++) {
                if (contact.self === _contacts[j].self) {
                    this.splice('_contacts', j, 1);
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (contact.self === allContacts[k].self) {
                    this.splice('_allContacts', k, 1);
                    break;
                }
            }

            this._totalContacts--;
        }

        if (0 === this._contacts.length) {
            this._handleEmptyLoad();
        }
    }
}
window.customElements.define(AppscoCompanyGroupContacts.is, AppscoCompanyGroupContacts);
