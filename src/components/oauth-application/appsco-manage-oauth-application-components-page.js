import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import './appsco-oauth-application-details.js';
import './appsco-oauth-application-certificates.js';
import './appsco-oauth-application-authorizations.js';
import '../page/appsco-layout-with-cards-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageOAuthApplicationComponentsPage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-layout-with-cards-styles">
            :host {
                --application-details-value: {
                    font-size: 14px;
                };

                --list-container: {
                    min-height: inherit;
                };

                --item-basic-info: {
                    padding: 0;
                };
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="cols-layout three-cols-layout">
            <div class="col">
                <paper-card heading="Settings" class="appsco-application-settings-card">
                    <div class="card-content">
                        <appsco-oauth-application-details application="[[ application ]]"></appsco-oauth-application-details>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageApplicationSettingsAction">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Certificates" class="appsco-application-certificates-card">
                    <div class="card-content">
                        <appsco-oauth-application-certificates id="appscoOAuthApplicationCertificates" type="certificate" authorization-token="[[ authorizationToken ]]" list-api="[[ certificatesApi ]]" api-errors="[[ apiErrors ]]" size="10" load-more="" preview="" on-remove-item="_onRemoveCertificateAction"></appsco-oauth-application-certificates>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageApplicationCertificatesAction">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Users" class="appsco-application-users-card">
                    <div class="card-content">
                        <appsco-oauth-application-authorizations application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-oauth-application-authorizations>
                    </div>
                </paper-card>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-manage-oauth-application-components-page'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            certificatesApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
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
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: dom(this.root).querySelectorAll('paper-card'),
                nodeDelay: 50,
                timing: {
                    delay: 200,
                    duration: 100
                }
            },
            'exit': [{
                name: 'hero-animation',
                id: 'hero',
                fromPage: this
            }, {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }]
        };
    }

    reloadCertificates() {
        this.$.appscoOAuthApplicationCertificates.reloadItems();
    }

    _setSharedElement(target) {
        while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
            target = target.parentNode;
        }

        this.sharedElements = {
            'hero': target
        };
    }

    _onManageApplicationSettingsAction(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-application-settings', { bubbles: true, composed: true }));
    }

    _onManageApplicationCertificatesAction(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-application-certificates', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoManageOAuthApplicationComponentsPage.is, AppscoManageOAuthApplicationComponentsPage);
