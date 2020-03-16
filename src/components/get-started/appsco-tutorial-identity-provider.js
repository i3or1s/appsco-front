import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import Popper from "popper.js";
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoTutorialIdentityProvider extends mixinBehaviors([
    AppscoTutorialBehaviour,
    AppscoCoverBehaviour
], DisableUpgradeMixin(PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host {
            }
            :host .fail-step,
            :host .step{
                z-index: 9000;
                background-color: var(--header-background-color);
                color: var(--header-text-color);
                border: 1px solid rgba(0,0,0,0.3);

                padding: 10px;
                @apply --shadow-elevation-8dp;
                margin-left:10px;
            }
            .flex-horizontal {
                @apply --layout-horizontal;
            }
            .empty {
                @apply --layout-flex;
            }
            :host #step-6 a {
                text-decoration: none;
                color: inherit;
            }
        </style>

        <div id="popper-fail-identity-provider-tutorial" class="fail-step" hidden="">
            <p>There are no verified domains in the company. <br>
                Please verify at least one and restart this tutorial.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button>Close</paper-button>
                </div>
            </div>
        </div>

        <div id="step-1" class="step" hidden="">
            <p>Setting up an Identity provider is an advanced feature. <br>
                You might need help to complete this process. <br>
                Open the company menu to get started.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_readMore">Read more</paper-button>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-2" class="step" hidden="">
            <p>You can set up an external Identity provider here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Go to IdP Settings to configure an Identity provider.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="" style="position: absolute">
            <p>Click on Manage of the domain you registered. <br>
                The setup must be done on both AppsCo and the Identity provider side.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="" style="position: absolute">
            <p>Click SAVE once you are done.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-6" class="step" hidden="">
            <p>
                You have seen how to set up an Identity provider. <br>
                Refer to the linked articles to learn more. <br>
                Open the company menu to continue with the Get started tutorial.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_readMore">Read more</paper-button>
                    <paper-button on-tap="_nextStep">Done</paper-button>
                </div>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-tutorial-identity-provider'; }

    static get properties() {
        return {
            page: {
                type: String
            },

            companyDomainsLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    constructor() {
        super();

        this.tutorialId = 'identity_provider';
        this.tutorialTitle = 'Identity provider';
        this.description = 'Set up an external identity provider';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/sections/360002084471-Identity-Provider-Settings';
    }

    ready() {
        super.ready();

        this.tutorialId = 'identity_provider';
        this.tutorialTitle = 'Identity provider';
        this.description = 'Set up an external identity provider';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/sections/360002084471-Identity-Provider-Settings';

        afterNextRender(this, function() {
            this.init();
        });
    }

    _readMore() {
        window.open(this.readme, '_blank');
    }

    pageChanged() {
        if(this.page !== 'company' && this.step === 2) {
            this.reset();
        }
    }

    getPopperConfig() {
        return {
            step1: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step2: {
                reference: [ '#menuCompanySettingsText' ],
                coverTarget: [ '#menuContainer' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step3: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsManageIdpCardBtn' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsManageIdpCard' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step4: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyManageIdPSettingsPage', '#appscoCompanyIdPDomainsPage', '#appscoCompanyIdPDomains', 'appsco-company-idp-domain-item', 'paper-button.manage-domain-action' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyManageIdPSettingsPage', '#appscoCompanyIdPDomainsPage', '#appscoCompanyIdPDomains', 'appsco-company-idp-domain-item', 'paper-button.manage-domain-action' ],
                popperOptions: {
                    placement: 'left-start'
                }
            },
            step5: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyManageIdPSettingsPage', '#appscoCompanyIdPSettingsPage', '#appscoCompanyIdPSettings', 'paper-button.submit-button' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyManageIdPSettingsPage', '#appscoCompanyIdPSettingsPage' ],
                popperOptions: {
                    placement: 'left'
                }
            },
            step6: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
                popperOptions: {
                    placement: 'right-start'
                }
            }
        };
    }

    step3(index, item, doneBuildingPopperHandler) {
        const handleFunction = function () {
            const element = this._querySelector([ '#appscoCompanyPage', '#appscoCompanyComponentsPage' ]);
            if (this.page !== 'company') {
                return;
            }
            if (!element || this.page !== 'company' || !this.companyDomainsLoaded) {
                setTimeout(handleFunction, 200);
                return;
            }
            element.scrollTop = 0;
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this);
        setTimeout(handleFunction, 300);
    }

    step4(index, item, doneBuildingPopperHandler) {
        const closeElement = this._querySelector([ '#appscoCompanyPage', '#appscoCompanyManageIdPSettingsPage', '#appscoCompanyIdPSettingsPage', 'paper-icon-button.page-close-action' ]);
        if (closeElement) {
            closeElement.click();
        }
        const handleFunction = function () {
            const element = this._querySelector([ '#appscoCompanyPage', '#appscoCompanyManageIdPSettingsPage', '#appscoCompanyIdPDomainsPage', '#appscoCompanyIdPDomains', 'appsco-company-idp-domain-item', 'paper-button.manage-domain-action' ]);
            if (this.page !== 'company') {
                return;
            }

            if (this.companyDomainsLoaded && !element) {
                const cover = this.buildCover(this._querySelector([ '#appscoCompanyPage', '#appscoCompanyManageIdPSettingsPage',  '#appscoCompanyIdPDomainsPage' ])),
                    failElement = this._querySelector([ '#appscoTutorial', '#identityProvider', '#popper-fail-identity-provider-tutorial' ]),
                    closeButton = this._querySelector([ '#appscoTutorial', '#identityProvider', '#popper-fail-identity-provider-tutorial paper-button' ]),
                    popper = new Popper(this._querySelector( [ '#appscoTutorial', '#identityProvider', '#popper-fail-identity-provider-tutorial' ]), failElement, {
                        placement: 'top-start'
                    }),
                    closeListener = function () {
                        cover.destroy();
                        popper.destroy();
                        failElement.hidden = true;
                        closeButton.removeEventListener('click', closeListener);
                        this.reset();
                    }.bind(this);
                closeButton.addEventListener('click', closeListener);

                cover.show();
                failElement.hidden = false;

                return;
            }

            if (!element || this.page !== 'company' || !this.companyDomainsLoaded) {
                setTimeout(handleFunction, 500);
                return;
            }
            element.scrollTop = 0;
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this);
        setTimeout(handleFunction, 500);
    }

    step5(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this), 400);
    }

    start() {
        this.step = 0;
        this.nextStep();
    }

    _nextStep() {
        this.currentStep.reference.click();
    }
}
window.customElements.define(AppscoTutorialIdentityProvider.is, AppscoTutorialIdentityProvider);
