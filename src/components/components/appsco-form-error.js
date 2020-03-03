import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoFormError extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                width: 100%;
                display: none;
                @apply --appsco-form-error;
            }
            :host .error-box {
                min-height: 38px;
                padding: 12px;
                margin: 10px 0;
                background-color: var(--form-error-background-color, #ffefef);
                color: var(--form-error-text-color, #ff0000);
                font-size: 12px;
                box-sizing: border-box;

                @apply --form-error-box;
            }
        </style>

        <div class="error-box">
            [[ message ]]
        </div>
`;
    }

    static get is() { return 'appsco-form-error'; }

    static get properties() {
        return {
            /**
             * Indicates if error exists.
             */
            _error: {
                type: Boolean,
                computed: '_checkIfErrorExists(message)'
            },

            /**
             * Message to display in error box.
             */
            message: {
                type: String,
                value: '',
                notify: true
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_onMessageChanged(message)'
        ]
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
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

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
    }

    _checkIfErrorExists(message) {
        return (message && message.toString().trim() !== '');
    }

    _onMessageChanged() {
        if (this._error) {
            this.playAnimation('entry');
            this.style.display = 'block';
        }
        else {
            this.playAnimation('exit');
        }
    }

    _onNeonAnimationFinish() {
        if (!this._error) {
            this.style.display = 'none';
        }
    }
}
window.customElements.define(AppscoFormError.is, AppscoFormError);
