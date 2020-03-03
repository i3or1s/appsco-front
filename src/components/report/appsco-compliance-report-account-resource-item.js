import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../resource/appsco-resource-auth-type.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoComplianceReportAccountResourceItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                @apply --appsco-compliance-report-account-resource;
            }
            .resource {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --compliance-report-account-resource;
            }
            .resource-icon {
                @apply --layout-flex-none;
                width: 24px;
                height: 24px;
                margin-right: 5px;
            }
            .resource-title {
                @apply --layout-horizontal;
                width: 255px;
                overflow: hidden;
                margin-right: 10px;
                font-size: 14px;
                color: var(--primary-text-color);
            }
            .resource-compliance-fields {
                @apply --layout-flex-none;
                @apply --paper-font-common-nowrap;
                margin-right: 10px;
                font-size: 14px;
                color: var(--secondary-text-color);
            }
            appsco-resource-auth-type {
                @apply --layout-flex-none;
                @apply --paper-font-common-nowrap;
                color: var(--secondary-text-color);
            }
        </style>

        <div class="resource">
            <iron-image class="resource-icon" sizing="cover" src="[[ item.application_url ]]"></iron-image>
            <span class="resource-title">[[ item.title ]]</span>
            <span class="resource-compliance-fields">[[ fields ]]</span>
        </div>
`;
    }

    static get is() { return 'appsco-compliance-report-account-resource-item'; }

    static get properties() {
        return {
            item: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            fields: {
                type: String,
                computed: '_computeFields(item)'
            }
        };
    }

    _computeFields(item) {
        return item && item.compliance && item.compliance.fields
            ? item.compliance.fields
            : 'none';
    }
}
window.customElements.define(AppscoComplianceReportAccountResourceItem.is, AppscoComplianceReportAccountResourceItem);
