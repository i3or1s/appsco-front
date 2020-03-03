import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-styles/shadow.js';
import '../components/components/appsco-date-format.js';
import '../components/components/appsco-price.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoBillingInvoice extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
            }
            :host .invoice {
                @apply --layout-horizontal;
                @apply --layout-center;
                width: 100%;
                height: 50px;
                padding: 10px;
                margin: 0;
                background-color: #ffffff;
                cursor: pointer;
                border-radius: 3px;
                box-sizing: border-box;
                transition: all 0.1s ease-out;
            }
            :host .invoice:hover {
                @apply --shadow-elevation-3dp;
            }
            :host([active]) .invoice {
                background: var(--brand-color);
                color: var(--brand-text-color);
                transition: all 0.2s ease-in;
            }
            :host appsco-date-format {
                @apply --layout-flex;
            }
        </style>

        <paper-material elavation="1" class="invoice flex-horizontal">
            <appsco-date-format date="[[ invoice.date.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>

            <appsco-price price="[[ invoice.total ]]" currency="[[ invoice.currency ]]"></appsco-price>
        </paper-material>
`;
    }

    static get is() { return 'appsco-billing-invoice'; }

    static get properties() {
        return {
            invoice: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            active: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
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
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 200
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 100
                }
            }
        };

        beforeNextRender(this, function() {
            this.style.display = 'block';
        });

        afterNextRender(this, function() {
            this.playAnimation('entry');
        });
    }

    select() {
        this.active = true;
    }

    deselect() {
        this.active = false;
    }
}
window.customElements.define(AppscoBillingInvoice.is, AppscoBillingInvoice);
