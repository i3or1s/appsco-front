import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoReportItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                width: 100%;
                margin-bottom: 10px;
            }
            .report-icon {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 50%;
                background-color: var(--report-icon-background-color, var(--account-initials-background-color));
                position: relative;
                @apply --layout-flex-none;
                @apply --report-icon;
            }
            .report-icon::shadow #sizedImgDiv, :host .report-icon::shadow #placeholder {
                border-radius: 50%;
            }
            .report-icon iron-icon {
                width: 24px;
                height: 24px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
            :host([tablet-screen]) .item-additional-info {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" on-tap="_onItemAction">
            <div class="report-icon">
                <iron-icon icon="[[ item.icon ]]"></iron-icon>
            </div>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.title ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Info:&nbsp;</span>
                    <span class="info-value">[[ item.description ]]</span>
                </div>
            </div>

            <div class="actions">
                <paper-button on-tap="_onOpenItemAction">Open</paper-button>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-report-item'; }

    static get properties() {
        return {
            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            item: {
                type: Object,
                value:function() {
                    return {};
                }
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this.dispatchEvent(new CustomEvent('component-ready', {bubbles: true, composed: true}));
        });
    }

    openReport() {
        this.dispatchEvent(new CustomEvent(this.item.openEvent, { bubbles: true, composed: true }));
    }

    _onOpenItemAction(event) {
        event.stopPropagation();
        this.openReport();
    }
}
window.customElements.define(AppscoReportItem.is, AppscoReportItem);
