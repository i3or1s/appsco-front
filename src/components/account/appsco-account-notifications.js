import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-button/paper-button.js';
import '../components/appsco-list-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountNotifications extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                width: 100%;
            @apply --layout-vertical;
            @apply --appsco-account-notifications;
            }
            .account-notifications {
                padding-top: 10px;
                position: relative;
            @apply --appsco-account-notifications-container;
            }
            :host appsco-list-item {
                font-size: 14px;
                padding: 20px 6px 10px 6px;
            @apply --account-notifications-appsco-list-item;
            }
            :host appsco-list-item:first-of-type {
            @apply --account-notifications-appsco-list-item-first;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                padding: 0 16px;
            @apply --paper-font-body2;
            @apply --info-message;
            }
            :host paper-progress {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 100%;
            @apply --appsco-account-notifications-paper-progress;
            }
            :host paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
            @apply --load-more-button;
            }
        </style>

        <iron-ajax id="ironAjaxNotifications" url="{{ _computedUrl }}" method="GET" headers="{{ _headers }}" handle-as="json" on-error="_handleError" on-response="_handleResponse">
        </iron-ajax>

        <div class="account-notifications">

            <paper-progress id="progress" indeterminate=""></paper-progress>

            <template is="dom-repeat" items="{{ _notifications }}">

                <appsco-list-item item="[[ _mapToListItem(item) ]]">
                </appsco-list-item>

            </template>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>

            <paper-button id="loadMore" class="load-more-button" hidden="[[ !loadMore ]]" on-tap="_loadMore">Load More</paper-button>

        </div>
`;
    }

    static get is() { return 'appsco-account-notifications'; }

    static get properties() {
        return {
            notificationsApi: {
                type: String
            },

            _nextPage: {
                type: Number,
                value: 1
            },

            size: {
                type: Number,
                value: 5
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            _computedUrl: {
                type: String
            },

            _notifications: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _message: {
                type: String
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this.$.loadMore.disabled = false;
            this.dispatchEvent(new CustomEvent('notifications-attached', { bubbles: true, composed: true }));
        });
    }

    _computeUrl(notificationsApi) {
        return notificationsApi + '?page=' + this._nextPage + '&limit=' + this.size;
    }

    /**
     * Maps notification object to list-item object.
     *
     * @param {Object} item
     * @returns {{ item: object }}
     * @private
     */
    _mapToListItem(item) {
        let icon = item.imageUrl,
            domain = window.location.protocol + '//' + window.location.hostname,
            result = null;

        if (icon && icon.indexOf('/public/pic') > -1) {
            icon = domain + icon;
        }
        if (item.type === 'message') {
            result = {
                account: item.sender,
                date: item.createdAt,
                message: this._getNotificationMessage(item.body)
            };
            if(item.sender && !item.sender.email) {
                result.icon = '/images/message.png';
                result.account = null;
            }
        } else {
            result = {
                icon: icon,
                date: item.createdAt,
                message: this._getNotificationMessage(item.body)
            };
        }

        return result;
    }

    _getNotificationMessage(notification) {
        const dom = document.createElement('div');
        dom.innerHTML = notification;

        return dom.getElementsByClassName('notification-message')[0].textContent;
    }

    loadNotifications() {
        this.$.progress.hidden = false;
        this.set('_notifications', []);
        this._message = '';
        this._nextPage = 1;

        this.$.ironAjaxNotifications.url = this._computeUrl(this.notificationsApi);
        this.$.ironAjaxNotifications.generateRequest();
    }

    _loadMore() {
        this.$.progress.hidden = false;

        this.$.ironAjaxNotifications.url = this._computeUrl(this.notificationsApi);
        this.$.ironAjaxNotifications.generateRequest();
    }

    _handleError(event) {
        this._message = 'We couldn\'t load notifications at the moment. Please try again in a minute. If error continues contact us.';
        this._hideProgressBar();
    }

    _handleResponse(event) {
        const notifications = event.detail.response,
            currentLength = this._notifications.length;

        if (notifications && notifications.length > 0) {
            this.$.loadMore.disabled = false;
            this._nextPage += 1;

            notifications.forEach(function(notification, i) {
                setTimeout( function() {
                    this.push('_notifications', notifications[i]);

                    if (i === (notifications.length - 1)) {
                        this._hideProgressBar();

                        if (notifications.length < this.size) {
                            this.$.loadMore.disabled = true;
                        }
                        this.dispatchEvent(new CustomEvent('notifications-load', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                notifications: notifications
                            }
                        }));
                    }
                }.bind(this));
            }.bind(this));
        }
        else if (notifications && !notifications.length) {
            if (!currentLength) {
                this._message = 'There are no notifications.';
            }

            this.$.loadMore.disabled = true;
            this._hideProgressBar();
        }
        else if (!currentLength) {
            this._message = 'We couldn\'t load notifications at the moment.';
            this._hideProgressBar();
        }
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.$.progress.hidden = true;
        }.bind(this), 500);
    }
}
window.customElements.define(AppscoAccountNotifications.is, AppscoAccountNotifications);
