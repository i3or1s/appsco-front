import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationSettingsCard extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --appsco-application-settings-card;
                display: none;
            }
            .info {
                @apply --info-message;
            }
        </style>

        <div>
            <p class="info">
                Place to manage settings specific to the resource type.
            </p>
        </div>
`;
    }

    static get is() { return 'appsco-application-settings-card'; }

    static get properties() {
        return {
            /**
             * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
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
            this._showApplicationDetails();
        });
    }

    _showApplicationDetails() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }
}
window.customElements.define(AppscoApplicationSettingsCard.is, AppscoApplicationSettingsCard);
