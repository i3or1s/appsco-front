import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoNotificationIcon extends PolymerElement {
    static get template() {
        return html`
        <style>
            div.notification-count {
                position: absolute;
            }

            :host {
                display: inline-block;
                position: relative;
                outline: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                cursor: pointer;
                z-index: 0;
                line-height: 1;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                -webkit-tap-highlight-color: transparent;
                box-sizing: border-box !important;
                padding: 0;
                width: 24px;
                height: 24px;
                margin-right: 6px;
                color: #414042;
            }

            .notification-count {
                width: 20px;
                height: 8px;
                background-color: #f7931f;
                border-radius: 40%;
                color: white;
                z-index: 99;
                font-size: 10px;
                padding-top: 3px;
                padding-bottom: 3px;
                text-align: center;
                margin-left: -3px;
                font-weight: bold;
                opacity: 0.9;
            }

            :host paper-icon-button {
                color: var(--appsco-account-action-color);
            }

            :host([has-notifications]) paper-icon-button {
                color: var(--appsco-account-new-notifications-color, var(--primary-color));
                --paper-icon-button-ink-color: var(--appsco-account-new-notifications-color, var(--primary-color));
            }

            :host .notification-count {
                display: none;
            }

            :host([has-notifications]) .notification-count {
                display: block;
            }


        </style>
        <div class="notification-icon">
            <div class="notification-count"> [[ notificationCount ]] </div>
            <paper-icon-button id="newNotificationsAction" class="action-icon new-notifications-icon" icon="social:notifications" title="Notifications"></paper-icon-button>
        </div>
`;
    }

    static get is() { return 'appsco-notification-icon'; }

    static get properties() {
        return {
            notificationCount: {
                type: Number,
                value: 0
            },

            hasNotifications: {
                type: Boolean,
                value: false,
                computed: '_computeHasNotifications(notificationCount)',
                reflectToAttribute: true
            }
        };
    }

    _computeHasNotifications(notificationCount) {
        return notificationCount > 0;
    }

    setNotificationsCount(notificationsCount) {
        this.notificationCount = notificationsCount;
    }
}
window.customElements.define(AppscoNotificationIcon.is, AppscoNotificationIcon);
