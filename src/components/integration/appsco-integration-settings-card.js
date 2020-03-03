import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationSettingsCard extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                @apply --appsco-integration-settings-card;
            }
            .info {
                @apply --info-message;
            }
        </style>

        <div>
            <p class="info">
                Here you can manage all the global rules that are applied across entire integration.
            </p>
            <p class="info">
                Change integration title.
            </p>
            <p class="info">
                Adjust integration sync interval. Activate / deactivate entire integration.
            </p>
        </div>
`;
    }

    static get is() { return 'appsco-integration-settings-card'; }

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
                    duration: 500
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

        afterNextRender(this, function() {
            this._showIntegrationDetails();
        });
    }

    _showIntegrationDetails() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }
}
window.customElements.define(AppscoIntegrationSettingsCard.is, AppscoIntegrationSettingsCard);
