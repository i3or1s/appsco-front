import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoOAuthApplicationAuthorizations extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --appsco-oauth-application-authorizations;
                display: none;
            }
            :host .info {
                @apply --info-message;
            }
        </style>

        <iron-ajax auto="" url="[[ _getAuthorizationsApi ]]" headers="[[ _headers ]]" on-error="_onGetAuthorizationsError" on-response="_onGetAuthorizationsResponse"></iron-ajax>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <p class="info">
            Number of authorizations: [[ _numberOfAuthorizations ]].
        </p>
`;
    }

    static get is() { return 'appsco-oauth-application-authorizations'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _getAuthorizationsApi: {
                type: String,
                computed: '_computeGetAuthorizationsApi(application)'
            },

            _numberOfAuthorizations: {
                type: Number,
                value: 0
            },

            _errorMessage: {
                type: String
            },

            animationConfig: {
                value: function () {
                    return {

                    }
                }
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

        afterNextRender(this, function () {
            this._showApplicationAuthorizations();
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('application-changed', this._onApplicationChanged);
    }

    _computeGetAuthorizationsApi(application) {
        return application.self ? (application.self + '/authorizations-count') : null;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _onApplicationChanged() {
        this._showApplicationAuthorizations();
    }

    _showApplicationAuthorizations() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }

    _onGetAuthorizationsError(event) {
        this._numberOfAuthorizations = 0;
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
    }

    _onGetAuthorizationsResponse(event) {
        const response = event.detail.response;

        this._numberOfAuthorizations = (response && response.authorizations_count) ? response.authorizations_count : 0;
    }
}
window.customElements.define(AppscoOAuthApplicationAuthorizations.is, AppscoOAuthApplicationAuthorizations);
