import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyBrandDetails extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;

                --preview-brand-color: var(--brand-color);
                --preview-brand-text-color: var(--brand-text-color);
                --preview-brand-border: var(--border-color);
                --preview-brand-text-border: var(--border-color);
            }
            :host > div {
                margin: 6px 0;
                @apply --company-details-container;
            }
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --company-details-label;
            }
            :host div[content] {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                @apply --company-details-value;
                padding: 1px 0;
            }
            :host .flex {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
            }
            :host .brand-color {
                width: 70px;
                height: 15px;
                background-color: var(--preview-brand-color);
                border: 1px solid var(--preview-brand-border);
            }
            :host .brand-text-color {
                width: 70px;
                height: 15px;
                background-color: var(--preview-brand-text-color);
                border: 1px solid var(--preview-brand-text-border);
            }
            :host .company-logo {
                width: 70px;
                @apply --company-logo;
            }
        </style>

        <!--<div hidden\$="[[ !company.name ]]">-->
        <div>
            <div label="">Brand color</div>
            <div content="">
                <div id="brandColor" class="brand-color"></div>
            </div>
        </div>

        <!--<div hidden\$="[[ !company.name ]]">-->
        <div>
            <div label="">Brand text color</div>
            <div content="">
                <div id="brandTextColor" class="brand-text-color"></div>
            </div>
        </div>

        <div>
            <template is="dom-if" if="[[ company.image ]]">
                <div label="">Logo</div>
                <div content="">
                    <img src="[[ company.image ]]" alt="[[ company.name ]]" class="company-logo">
                </div>
            </template>
            <template is="dom-if" if="[[ !company.image ]]">

                <div content="">
                    <img src="[[ brandLogo ]]" alt="[[ company.name ]]" class="company-logo">
                </div>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-company-brand-details'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onCompanyChanged'
            },

            brandLogo: {
                type: String,
                value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAgCAYAAAB+ZAqzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVZJREFUeNrsmOENgjAQhcE4AG5QN2AERnCEjsAIdQJG6AiO0BEcATdwhLONxJR6V1u8Ij98ycXkrL3HR+8gVlWCAEDa0EjuaqP1csLGkPJ7FtlNR3hKIzknNeV0uC5YqzhNSc/AiORgKiyCnCbWSm5ar02DHEzFhyB3J9aCf/tL02qckSCvbHSAy60Va9BSSGFn1gAt1zjNlmj5Mr+gdYE0aXZahFmFdOgnSW5aEikivHmWo1NJWnoBLf8ItFujNWumErSwDs3V+xjJoNURtBTwSC6lZQrRmtXhoNXa6IFPIwctE3lYf3crv6TVER26Ki29RVpiNVoJkz+FlmGnlTD5Y7ROia82q9Iat0ALG5xyml3laUXMqkSKZWgRpiha4k+LMPYzWvuYsbquDxhFxn8fzmTt3DNnP9xVNgymbvbCj9SXu8zNeiZTUVocZ27pe/3HA/8QYABzJAP50CmRFwAAAABJRU5ErkJggg=='
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
    }

    _onCompanyChanged(company) {
        var brandColor = company.primary_color,
            brandTextColor = company.secondary_color;

        this.updateStyles({
            '--preview-brand-color': (company && brandColor) ? brandColor : 'var(--brand-color)',
            '--preview-brand-border': (!brandColor || '#fff' === brandColor || '#ffffff' === brandColor) ? 'var(--border-color)' : 'transparent',
            '--preview-brand-text-color': (company && brandTextColor) ? brandTextColor : 'var(--brand-text-color)',
            '--preview-brand-text-border': (!brandTextColor || '#fff' === brandTextColor || '#ffffff' === brandTextColor) ? 'var(--border-color)' : 'transparent'
        });
        this._showDetails();
    }

    _showDetails() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }
}
window.customElements.define(AppscoCompanyBrandDetails.is, AppscoCompanyBrandDetails);
