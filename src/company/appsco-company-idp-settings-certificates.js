import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import './appsco-company-idp-domain-item.js';
import './appsco-company-idp-settings-certificate-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyIdpSettingsCertificates extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --appsco-company-certificates;
            }

            :host .add-action {
                @apply --primary-button;
            }

            :host .pull-right {
                float: right;
            }

            :host .certificates {
                margin-bottom: 10px;
            }

        </style>

        <div class="certificates-container">

            <p>Certificates: </p>

            <template is="dom-if" if="[[ !_certificatesEmpty ]]">
                <div class="certificates">
                    <template is="dom-repeat" items="[[ certificates ]]">
                        <appsco-company-idp-settings-certificate-item id="appscoCertificateItem_[[ index ]]" certificate="{{ item }}" on-remove-idp-certificate="_removeCert">
                        </appsco-company-idp-settings-certificate-item>
                    </template>
                </div>
            </template>

            <paper-button class="add-action pull-right" on-tap="_onAddCertificateAction">Add certificate</paper-button>

        </div>
`;
    }

    static get is() { return 'appsco-company-idp-settings-certificates'; }

    static get properties() {
        return {
            certificates: {
                type: Array,
                value: function () {
                    return []
                }
            },

            _certificatesEmpty: {
                type: Boolean,
                computed: '_computeCertificatesEmpty(certificates)'
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
                name: 'cascaded-animation',
                animation: 'slide-from-left-animation',
                nodes: [],
                nodeDelay: 50,
                timing: {
                    duration: 300
                }
            }
        };
    }

    _computeCertificatesEmpty(certificates) {
        return !certificates || certificates.length === 0;
    }

    addCertificate(certificate) {
        if (!this.certificates) {
            this.certificates = [];
        }
        this.certificates.push(certificate);
        this.certificates = JSON.parse(JSON.stringify(this.certificates));

        this.dispatchEvent(new CustomEvent('idp-certificate-added', {
            bubbles: true,
            composed: true,
            detail: {
                source: this
            }
        }));
    }

    getCertificates() {
        return this.certificates;
    }

    _onAddCertificateAction() {
        this.dispatchEvent(new CustomEvent('idp-certificate-add', {
            bubbles: true,
            composed: true,
            detail: {
                source: this
            }
        }));
    }

    _removeCert(event) {
        const index = this.certificates.indexOf(event.detail.certificate);
        if (index > -1) {
            this.certificates.splice(index, 1);
            this.set('certificates', JSON.parse(JSON.stringify(this.certificates)));
        }
    }
}
window.customElements.define(AppscoCompanyIdpSettingsCertificates.is, AppscoCompanyIdpSettingsCertificates);
