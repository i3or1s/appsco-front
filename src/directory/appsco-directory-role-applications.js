import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import './appsco-directory-role-application.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDirectoryRoleApplications extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                color: var(--primary-text-color);
            }
            :host paper-progress {
                width: 100%;
                --paper-progress-active-color: #7baaf7;
                @apply --appsco-list-progress-bar;
                display: block;
            }
            :host .progress {
                height: 6px;
            }
            :host .info-total {
                margin-bottom: 10px;
            }
            :host .total {
                @apply --paper-font-caption;
                opacity: 0.6;
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
            :host appsco-directory-role-application {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-directory-role-application;
            }
            :host([preview]) appsco-directory-role-application {
                width: auto;
                margin: 0 0 5px 0;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
            }
        </style>

        <iron-ajax id="getApplicationsCall" url="[[ _computedAction ]]" headers="[[ _headers ]]" method="GET" handle-as="json" on-response="_handleResponse" on-error="_handleError">
        </iron-ajax>

        <div class="applications">
            <div class="progress">
                <paper-progress id="progress" indeterminate=""></paper-progress>
            </div>

            <template is="dom-if" if="[[ !preview ]]">
                <div class="info-total" hidden\$="[[ !_totalApplications ]]">
                    <span class="total">Total resources: [[ _totalApplications ]]</span>
                </div>
            </template>

            <div class="flex-vertical">
                <template is="dom-repeat" items="{{ _applications }}">
                    <appsco-directory-role-application application="[[ item ]]" assignee="[[ companyRole ]]" preview="[[ preview ]]" authorization-token="[[ authorizationToken ]]"></appsco-directory-role-application>
                </template>
            </div>
        </div>

        <template is="dom-if" if="[[ preview ]]">
            <div hidden\$="[[ !_totalApplications ]]">
                <span class="total">Total resources: [[ _totalApplications ]]</span>
            </div>
        </template>

        <template is="dom-if" if="[[ loadMore ]]">
            <paper-button on-tap="_loadMore" id="loadMore" class="load-more-button" hidden="[[ !_moreApplications ]]">Load More</paper-button>
        </template>

        <template is="dom-if" if="{{ _message }}">
            <p class="message">
                [[ _message ]]
            </p>
        </template>
`;
    }

    static get is() { return 'appsco-directory-role-applications'; }

    static get properties() {
        return {
            companyRole: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            /**
             * Number of applications to load.
             */
            size: {
                type: Number,
                value: 5
            },

            /**
             * Indicates if load more action should be available or not.
             */
            loadMore: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if applications should be in preview mode rather then full detailed view.
             */
            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Next page of applications to load.
             */
            _nextPage: {
                type: Number,
                value: 1
            },

            _moreApplications: {
                type: Boolean,
                value: true
            },

            _computedAction: {
                type: String
            },

            _applications: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _totalApplications: {
                type: Number
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            /**
             * Message to display instead of subscribers.
             */
            _message: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_computeAction(companyRole, _nextPage, size)',
            '_onCompanyRoleChanged(companyRole)'
        ];
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this.load();
        });
    }

    _onCompanyRoleChanged() {
        this.load();
    }

    _computeAction(companyRole, nextPage, size) {
        this._computedAction = companyRole.meta ? companyRole.meta.applications + '?page=' + nextPage + '&limit=' + size + '&extended=1' : null;
    }

    /**
     * Triggers ajax request in order to get notifications.
     */
    load() {
        this.$.progress.hidden = false;
        this._applications = [];
        this._message = '';
        this._nextPage = 1;

        this.$.getApplicationsCall.generateRequest();
    }

    _loadMore() {
        this.$.progress.hidden = false;

        this.$.getApplicationsCall.generateRequest();
    }

    /**
     * Handles error on get applications API request.
     * @param {Object} event Event from error response.
     *
     * @private
     */
    _handleError(event) {
        this._message = 'We couldn\'t load resources at the moment. Please try again in a minute. If error continues contact us.';
        this._handleEmpty();
    }

    /**
     * Handles response on get log API request.
     * @param {Object} event Event from response.
     *
     * @private
     */
    _handleResponse(event) {
        const response = event.detail.response;

        if (!response) {
            return false;
        }

        const applications = response.applications,
            currentLength = this._applications.length,
            total = response.meta.total;

        this._totalApplications = total;

        if (applications && applications.length > 0) {
            this._nextPage += 1;

            applications.forEach(function(application, index) {
                setTimeout( function() {
                    this.push('_applications', applications[index]);

                    if (index === (applications.length - 1)) {
                        this._moreApplications = this._applications.length !== total;

                        this._hideProgressBar();
                        this.dispatchEvent(new CustomEvent('applications-loaded', { bubbles: true, composed: true }));
                    }
                }.bind(this), (index + 1) * 30 );
            }.bind(this));
        }
        else if (applications && !applications.length) {
            if (!currentLength) {
                this._message = 'There are no company resources shared with this account.';
            }

            this._moreApplications = false;
            this._handleEmpty();
        }
        else if (!currentLength) {
            this._message = 'We couldn\'t load resources at the moment.';
            this._moreApplications = false;
            this._handleEmpty();
        }
    }

    _handleEmpty() {
        this._hideProgressBar();
        this.dispatchEvent(new CustomEvent('applications-empty', { bubbles: true, composed: true }));
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.$.progress.hidden = true;
        }.bind(this), 500);
    }

    reload() {
        this.set('_applications', []);
        this._nextPage = 1;
        this.$.getApplicationsCall.generateRequest();
    }
}
window.customElements.define(AppscoDirectoryRoleApplications.is, AppscoDirectoryRoleApplications);
