import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoLoader extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                background-color: rgba(255, 255, 255, 0.8);
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1000;
                display: none;

                --paper-spinner-layer-1-color: var(--appsco-purple-color);
                --paper-spinner-layer-2-color: var(--appsco-green-color);
                --paper-spinner-layer-3-color: var(--appsco-blue-color);
                --paper-spinner-layer-4-color: var(--appsco-yellow-color);
                --paper-spinner-color: var(--appsco-blue-color);
            }
            :host .paper-spinner {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                @apply --appsco-loader;
            }
        </style>

        <template is="dom-if" if="[[ multiColor ]]">
            <paper-spinner id="paperSpinner" class="paper-spinner" alt="[[ spinnerAlt ]]" active=""></paper-spinner>
        </template>

        <template is="dom-if" if="[[ !multiColor ]]">
            <paper-spinner-lite class="paper-spinner" alt="[[ spinnerAlt ]]" active=""></paper-spinner-lite>
        </template>
`;
    }

    static get is() { return 'appsco-loader'; }

    static get properties() {
        return {
            /**
             * Indicates if loader is active or not.
             */
            active: {
                type: Boolean,
                value: false,
                observer: '_onActiveChanged'
            },

            /**
             * Alt text for loader.
             */
            loaderAlt: {
                type: String,
                value: 'Appsco is loading'
            },

            /**
             * Indicates if loader is multicolored ot not.
             */
            multiColor: {
                type: Boolean,
                value: false,
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

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
    }

    _onActiveChanged(newValue, oldValue) {
        if (undefined === oldValue && !newValue) {
            return;
        }
        if (this.active) {
            this.style.display = 'block';
            this.playAnimation('entry');
        }
        else {
            this.playAnimation('exit');
        }
    }

    _onNeonAnimationFinish() {
        if (!this.active) {
            this.style.display = 'none';
        }
    }
}
window.customElements.define(AppscoLoader.is, AppscoLoader);
