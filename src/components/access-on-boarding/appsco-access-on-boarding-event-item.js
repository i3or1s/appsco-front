import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../components/appsco-date-format.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccessOnBoardingEventItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-item-styles"></style>

        <style>
            :host {
                @apply --appsco-access-on-boarding-event-item;
            }
            .resource {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --appsco-access-on-boarding-event;
            }
            .resource-icon {
                @apply --layout-flex-none;
                width: 24px;
                height: 24px;
                margin-right: 5px;
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
        </style>

        <iron-ajax auto="" url="[[ _eventTypesListUrl ]]" handle-as="json" on-response="_onEventTypesListResponse"></iron-ajax>

        <table>
            <tbody><tr hidden="">
                <th class="fixed-td"></th>
                <th class="fixed-td"></th>
                <th>Resource title</th>
                <th>Event</th>
                <th>Date</th>
                <th>Action required</th>
            </tr>
            <tr>
                <td class="fixed-td">
                    <paper-checkbox noink=""></paper-checkbox>
                </td>
                <td class="fixed-td">
                    <iron-image class="resource-icon" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ item.application_icon.application.application_url ]]"></iron-image>
                </td>
                <td>
                    <span class="resource-title">[[ item.application_icon.title ]]</span>
                </td>
                <td class="event">
                    {{ _getParameter(item, 'event') }}
                </td>
                <td>
                    <appsco-date-format date="[[ item.created_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>
                </td>
                <td>
                    {{ _getParameter(item, 'action') }}
                </td>
            </tr>
        </tbody></table>
`;
  }

  static get is() { return 'appsco-access-on-boarding-event-item'; }

  static get properties() {
      return {
          eventTypesList: {
              type: Array,
              value: function () {
                  return [];
              }
          }
      };
  }

  _getParameter(item, parameter) {
      if (this.eventTypesList) {
          const eventTypes = this.eventTypesList;

          for (let i = 0; i < eventTypes.length; i++) {
              const eventType = eventTypes[i];

              if (eventType.name === item.event_type) {
                  return eventType[parameter];
              }
          }
      }

      return '';
  }
}
window.customElements.define(AppscoAccessOnBoardingEventItem.is, AppscoAccessOnBoardingEventItem);
