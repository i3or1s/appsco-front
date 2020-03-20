import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-ajax/iron-request.js';
import '../account/appsco-account-image.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import './appsco-access-on-boarding-event-item.js';
import '../components/appsco-date-format.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccessOnBoardingRolesItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                --appsco-access-on-boarding-event-item: {
                    width: 100%;
                    padding-right: 0;
                    margin-bottom: 15px;
                    box-sizing: border-box;
                };

                --paper-checkbox-size: 24px;
                --paper-checkbox-unchecked-color: var(--primary-text-color);
                --paper-checkbox-checked-color: var(--primary-text-color);
            }
            appsco-account-image {
                --account-initials-background-color: var(--report-account-initials-background-color);
            }
            iron-collapse {
                @apply --shadow-elevation-2dp;
            }
            .events-container {
                padding: 20px;
                background-color: var(--collapsible-content-background-color);
                position: relative;
            }
            .event-list {
                width: 100%;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-wrap;
            }
            .message {
                @apply --info-message;
            }
            .resource-icon {
                width: 24px;
                height: 24px;
                margin-right: 5px;
                display: block;
            }
            .resource-title {
                @apply --paper-font-common-nowrap;
                margin-right: 10px;
                font-size: 12px;
                color: var(--secondary-text-color);
            }
            :host table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0 10px;
            }
            :host table tr th {
                font-size: 12px;
                font-weight: normal;
                color: var(--secondary-text-color);
                text-align: left;
            }
            :host table tr .fixed-td {
                width: 40px;
            }
            :host table tr td {
                font-size: 12px;
                color: var(--primary-text-color);
            }
            :host table tr td.event {
                color: var(--app-danger-color);
            }
            :host .list-actions {
                margin-top: 10px;
                @apply --layout-vertical;
                @apply --layout-end;
            }
            :host .resolve-action {
                @apply --primary-button;
                @apply --shadow-elevation-2dp;
                color: var(--primary-text-color);
                background-color: var(--item-background-color);
                border: none;

            }
            :host([screen800]) .item-additional-info {
                display: none;
            }
            :host .item-info {
                padding: 0 10px;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ screen800}}"></iron-media-query>

        <div class="item">
            <appsco-account-image account="[[ item.user_info ]]"></appsco-account-image>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.user_info.display_name ]]</span>
                <span class="info-value">[[ item.user_info.email ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Unresolved applications:&nbsp;</span>
                    <span class="info-value">{{ renderedCount }}</span>
                </div>
            </div>

            <div class="actions">
                <paper-button on-tap="_onShowEvents" hidden\$="[[ _eventsVisible ]]">Show</paper-button>
                <paper-button on-tap="_onHideEvents" hidden\$="[[ !_eventsVisible ]]">Hide</paper-button>
            </div>
        </div>

        <iron-collapse id="events">
            <div class="events-container">

                <appsco-loader class="dialog-loader" active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                <div class="event-list">
                    <table>
                        <tbody><tr>
                            <th class="fixed-td"></th>
                            <th class="fixed-td"></th>
                            <th>Resource title</th>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Action required</th>
                        </tr>

                        <template is="dom-repeat" items="[[ item.access_onboardings ]]" as="ev" filter="_isUnresolvedEvent" observe="status" rendered-item-count="{{ renderedCount }}">
                            <tr>
                                <td>
                                    <paper-checkbox noink="" checked="{{ ev.selected }}"></paper-checkbox>
                                </td>
                                <td>
                                    <iron-image class="resource-icon" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ ev.application_icon.application.application_url ]]"></iron-image>
                                </td>
                                <td>
                                    <span class="resource-title">[[ ev.application_icon.title ]]</span>
                                </td>
                                <td class="event">
                                    {{ _getParameter(ev, 'event') }}
                                </td>
                                <td>
                                    <appsco-date-format date="[[ ev.created_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>
                                </td>
                                <td>
                                    {{ _getParameter(ev, 'action') }}
                                </td>
                            </tr>
                        </template>
                    </tbody></table>
                </div>

                <div class="list-actions">
                    <paper-button class="resolve-action" on-tap="_onResolveSelectedAction">Mark as resolved</paper-button>
                </div>
            </div>
        </iron-collapse>
`;
    }

    static get is() { return 'appsco-access-on-boarding-roles-item'; }

    static get properties() {
        return {
            screen800: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            eventTypesList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _eventsVisible: {
                type: Boolean,
                value: false
            },

            _resolveRequests: {
                type: Number,
                value: 0
            },

            _resolvedEvents: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _unresolvedEvents: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(screen800)'
        ];
    }

    _updateScreen() {
        this.updateStyles();
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _onShowEvents() {
        this.$.events.show();
        this._eventsVisible = true;
    }

    _onHideEvents() {
        this.$.events.hide();
        this._eventsVisible = false;
    }

    _isUnresolvedEvent(item) {
        item.selected = item.selected ? item.selected : false;

        return ('unresolved' === item.status);
    }

    _getParameter(item, parameter) {
        const eventTypes = this.eventTypesList;

        for (let i = 0; i < eventTypes.length; i++) {
            const eventType = eventTypes[i];

            if (eventType.name === item.event_type) {
                return eventType[parameter];
            }
        }

        return '';
    }

    _removeItemIfNoUnresolvedEvents() {
        if (0 === this.item.access_onboardings.length) {
            this.dispatchEvent(new CustomEvent('remove-item', {
                bubbles: true,
                composed: true,
                detail: {
                    item: this.item
                }
            }));
        }
    }

    _onResolveEventsFinished() {
        if (0 < this._resolvedEvents.length) {
            this.dispatchEvent(new CustomEvent('access-on-boarding-events-resolved', {
                bubbles: true,
                composed: true,
                detail: {
                    resolvedItems: this._resolvedEvents,
                    unresolvedItems: this._unresolvedEvents
                }
            }));
        }
        else {
            this._showError('There was an error while resolving events. Please try again. If error continues contact AppsCo support.');
        }

        this.set('_resolvedEvents', []);
        this.set('_unresolvedEvents', []);
        this._hideLoader();
        this._removeItemIfNoUnresolvedEvents();
    }

    _resolveEvent(item) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: item.meta.resolve,
                    method: 'PUT',
                    handleAs: 'json',
                    headers: this._headers
                };

            request.send(options).then(function() {
                if (200 === request.status) {
                    resolve(request.response);
                }
            }.bind(this), function() {
                if (404 === request.status) {
                    reject(item);
                }
            }.bind(this));
        }.bind(this));
    }

    _removeResolvedEvent(item) {
        const events = this.item.access_onboardings,
            eventsClone = JSON.parse(JSON.stringify(this.item.access_onboardings));

        events.forEach(function(ev, i) {
            if (item.self === ev.self) {
                eventsClone.splice(i, 1);
            }
        }.bind(this));

        this.set('item.access_onboardings', []);
        this.set('item.access_onboardings', eventsClone);
    }

    _onResolveSelectedAction() {
        const resolveList = this.item.access_onboardings.filter(function (el) {
                return el.selected;
            }),
            length = resolveList.length;

        if (0 === length) {
            this._showError('Please select at least one event to resolve.');
            return false;
        }

        this._resolveRequests = length;

        this._showLoader();
        this._hideError();

        for (let i = 0; i < length; i++) {
            const item = resolveList[i];

            (function(me) {
                me._resolveEvent(item).then(function(item) {
                    me.push('_resolvedEvents', item);
                    me._removeResolvedEvent(item);
                    me._resolveRequests--;

                    if (me._resolveRequests === 0) {
                        me._onResolveEventsFinished();
                    }
                }.bind(me), function(item) {
                    me.push('_unresolvedEvents', item);
                    me._resolveRequests--;

                    if (me._resolveRequests === 0) {
                        me._onResolveEventsFinished();
                    }
                }.bind(me));

            })(this);
        }
    }
}
window.customElements.define(AppscoAccessOnBoardingRolesItem.is, AppscoAccessOnBoardingRolesItem);
