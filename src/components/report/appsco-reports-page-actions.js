import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../page/appsco-page-global.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoReportsPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host .page-actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                height: 100%;
            }
            :host .page-actions * {
                height: 100%;
            }
        </style>

        <div class="page-actions">
            <appsco-page-global info=""></appsco-page-global>
        </div>
`;
    }

    static get is() { return 'appsco-reports-page-actions'; }

    static get properties() {
        return {
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
                    delay: 200,
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };
    }
}
window.customElements.define(AppscoReportsPageActions.is, AppscoReportsPageActions);
