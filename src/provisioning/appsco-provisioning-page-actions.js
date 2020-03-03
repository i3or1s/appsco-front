import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-provisioning-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoProvisioningPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            :host > * {
                height: 100%;
            }
            appsco-provisioning-actions {
                @apply --layout-flex;
            }
        </style>

        <appsco-provisioning-actions id="appscoProvisioningActions"></appsco-provisioning-actions>
`;
    }

    static get is() { return 'appsco-provisioning-page-actions'; }

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

    resetPage() {
        this.$.appscoProvisioningActions.reset();
    }

    resetPageActions() {
        this.resetPage();
    }
}
window.customElements.define(AppscoProvisioningPageActions.is, AppscoProvisioningPageActions);
