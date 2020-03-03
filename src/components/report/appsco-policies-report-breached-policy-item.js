import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../components/appsco-date-format.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPoliciesReportBreachedPolicyItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                @apply --appsco-policies-report-breached-policy-item;
            }
            .policy {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --policies-report-breached-policy-item;
            }
            .policy-icon {
                @apply --layout-flex-none;
                width: 24px;
                height: 24px;
                margin-right: 10px;

                --iron-icon-fill-color: var(--secondary-text-color);
            }
            .policy-name {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
                margin-right: 10px;
                font-size: 14px;
                color: var(--primary-text-color);
            }
            .policy-created-at {
                @apply --layout-flex-none;
                font-size: 12px;
                color: var(--secondary-text-color);
            }
        </style>

        <div class="policy">
            <iron-icon class="policy-icon" icon="icons:verified-user"></iron-icon>
            <span class="policy-name">[[ item.data.name ]]</span>
            <appsco-date-format class="policy-created-at" date="[[ item.created_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
        </div>
`;
    }

    static get is() { return 'appsco-policies-report-breached-policy-item'; }
}
window.customElements.define(AppscoPoliciesReportBreachedPolicyItem.is, AppscoPoliciesReportBreachedPolicyItem);
