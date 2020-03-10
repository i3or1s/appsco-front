import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import './appsco-tutorial-company-settings.js';
import './appsco-tutorial-company-branding.js';
import './appsco-tutorial-branded-login.js';
import './appsco-tutorial-add-company-user.js';
import './appsco-tutorial-resources.js';
import './appsco-tutorial-company-domain.js';
import './appsco-tutorial-share-resources.js';
import './appsco-tutorial-identity-provider.js';
import './appsco-tutorial-provisioning.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import Popper from "popper.js";

class AppscoTutorial extends mixinBehaviors([AppscoCoverBehaviour, Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host .done-step {
                z-index: 9000;
                background-color: var(--header-background-color);
                color: var(--header-text-color);
                border: 1px solid rgba(0,0,0,0.3);

                padding: 10px;
                @apply --shadow-elevation-8dp;
                margin-left:10px;
            }
        </style>

        <appsco-tutorial-company-settings
            id="companyProfile"
            page="[[ currentPage ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-company-settings>

        <appsco-tutorial-company-branding
            id="companyBranding"
            page="[[ currentPage ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-company-branding>

        <appsco-tutorial-branded-login
            id="brandedLogin"
            page="[[ currentPage ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-branded-login>

        <appsco-tutorial-add-company-user
            id="addCompanyUser"
            page="[[ currentPage ]]"
            directory-page-loaded="[[ directoryPageLoaded ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-add-company-user>

        <appsco-tutorial-resources
            id="addResource"
            page="[[ currentPage ]]"
            resources-page-loaded="[[ resourcesPageLoaded ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-resources>

        <appsco-tutorial-share-resources 
            id="shareResource"
            page="[[ currentPage ]]"
            on-tutorial-done="_onTutorialDone"
            resources-page-loaded="[[ resourcesPageLoaded ]]"
            resource-share-accounts-loaded="[[ resourceShareAccountsLoaded ]]"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-share-resources>

        <appsco-tutorial-company-domain
            id="companyDomain"
            page="[[ currentPage ]]"
            company-domains-loaded="[[ companyDomainsLoaded ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-company-domain>

        <appsco-tutorial-identity-provider
            id="identityProvider"
            page="[[ currentPage ]]"
            company-domains-loaded="[[ companyDomainsLoaded ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-identity-provider>

        <appsco-tutorial-provisioning
            id="companyProvisioning"
            page="[[ currentPage ]]"
            on-tutorial-done="_onTutorialDone"
            on-tutorial-step-changed="_onStepChanged">
        </appsco-tutorial-provisioning>

        <div id="done-all-tutorials" class="done-step" hidden="">
            <p>You have completed all Get started steps. <br>
                You can replay them and refer to the linked articles on the welcome page to learn more.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button>Close</paper-button>
                </div>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-tutorial'; }

    static get properties() {
        return {
            currentPage: {
                type: String,
                notify: true,
                observer: '_pageChanged'
            },
            tutorialsApi: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },

            tuts: {
                type: Array,
                value: function () {
                    return [
                        'companyProfile',
                        'companyBranding',
                        'brandedLogin',
                        'addCompanyUser',
                        'addResource',
                        'shareResource',
                        'companyDomain',
                        'identityProvider',
                        'companyProvisioning'
                    ];
                }
            },

            tutorialResponse: {
                type: Object
            },

            tutorials: {
                type: Object,
                notify: true,
                reflectToAttribute: true,
                value: function () {
                    return {}
                }
            },

            _tutorialsInitialized: {
                type: Boolean,
                value: false
            },

            directoryPageLoaded: {
                type: Boolean,
                value: false,
                notify: true
            },

            resourcesPageLoaded: {
                type: Boolean,
                value: false,
                notify: true
            },

            companyDomainsLoaded: {
                type: Boolean
            },

            resourceShareAccountsLoaded: {
                type: Boolean,
                value: false
            },

            currentSteps: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            isTutorialActive: {
                type: Boolean,
                value: false,
                notify: true
            }
        };
    }

    static get observers() {
        return [
            '_applyTutorialStatus(tutorialResponse, _tutorialsInitialized)'
        ];
    }

    ready() {
        super.ready();

        this.initTutorials();

        afterNextRender(this, function() {
            if (undefined === this.tutorialResponse) {
                this.getCurrentState();
            }
        });
    }

    _pageChanged(){
        this.tuts.forEach(function(item, key){
            const tutorial = this.shadowRoot.getElementById(item);
            if(tutorial) {
                tutorial.pageChanged(this.currentPage);
            }
        }.bind(this));
    }

    getTutorials() {
        return this.tutorials;
    }

    getTutorial(tutorialId) {
        return this.tutorials[tutorialId];
    }

    initTutorials() {
        this.tuts.forEach(function(item, key){
            const tutorial = this.shadowRoot.getElementById(item);
            if(tutorial) {
                this.tutorials[tutorial.getId()] = tutorial;
            }
        }.bind(this));

        this._tutorialsInitialized = true;
    }

    _onTutorialDone(event) {
        const tutorial = event.detail.tutorial,
            tutorialsRequest = document.createElement('iron-request');

        tutorialsRequest.send({
            url: this.tutorialsApi,
            method: "PUT",
            handleAs: 'json',
            headers: this._headers,
            body: 'tutorial_info[tutorial_id]=' + tutorial.getId()
                + '&tutorial_info[status]=DONE'
                + '&tutorial_info[step]=' + tutorial.maxSteps
        }).then(function(request) {
            this.set('tutorialResponse', request.response)
        }.bind(this));

        for (const idx in this.tutorials) {
            if (this.tutorials.hasOwnProperty(idx)) {
                if (!this.tutorials[idx].isDone()) {
                    return;
                }
            }
        }

        this.showAllTutorialsDoneInfo();
    }

    showAllTutorialsDoneInfo() {
        const appscoApp = document.querySelector('appsco-app');
        let targetElement = appscoApp
            .shadowRoot.querySelector('appsco-header')
            .shadowRoot.getElementById('appscoHeaderAccountActions')
            .shadowRoot.querySelector('paper-icon-button.appsco-get-started-icon')
        ;

        const cover = this.buildCover(targetElement);
        let doneElement = this.shadowRoot.getElementById('done-all-tutorials');
        let closeButton = this.shadowRoot.querySelector('#done-all-tutorials paper-button');

        const closeListener = function () {
            cover.destroy();
            popper.destroy();
            doneElement.hidden = true;

            targetElement.removeEventListener('click', closeListener);
            closeButton.removeEventListener('click', closeListener);
        };
        const popper = new Popper(
            targetElement,
            doneElement,
            { placement: 'right-start' }
        );

        closeButton.addEventListener('click', closeListener);
        targetElement.addEventListener('click', closeListener);

        cover.show();
        doneElement.hidden = false;
    }

    _applyTutorialStatus(tutorialsInfo, tutorialsInitialized) {
        if (undefined === tutorialsInfo || !tutorialsInitialized) {
            return;
        }
        for (const idx in tutorialsInfo) {
            if (tutorialsInfo.hasOwnProperty(idx)) {
                this.tuts.forEach(function(tut) {
                    const tutorial = this.shadowRoot.getElementById(tut);
                    if (!tutorial) { return; }
                    if (tutorial.getId() === idx) {
                        tutorial.status = tutorialsInfo[idx]['status'];
                    }
                }.bind(this));
            }
        }

        const currentTutorials = this.tutorials;
        this.set('tutorials', {});
        this.set('tutorials', currentTutorials);
    }

    getCurrentState() {
        const tutorialsRequest = document.createElement('iron-request');

        tutorialsRequest.send({
            url: this.tutorialsApi,
            method: "GET",
            handleAs: 'json',
            headers: this._headers
        }).then(function(request) {
            this.set('tutorialResponse', request.response);
        }.bind(this));
    }

    startTutorial(tutorialId) {
        this.tuts.forEach(function(tut) {
            const tutorial = this.shadowRoot.getElementById(tut);
            if (!tutorial) { return; }
            if (tutorial.getId() === tutorialId) {
                tutorial.start();
            }
        }.bind(this));
    }

    notifyDomainAdded(domain) {
        this.$.companyDomain.domainAdded(domain);
    }

    _computeIsTutorialActive() {
        for(const idx in this.currentSteps) {
            if (this.currentSteps.hasOwnProperty(idx) && this.currentSteps[idx] > 0) {
                this.isTutorialActive = true;
                return;
            }
        }

        this.isTutorialActive = false;
    }

    _onStepChanged(event) {
        if (!this.currentSteps) {
            this.currentSteps = {};
        }
        this.currentSteps[event.detail.id] = event.detail.step;
        this._computeIsTutorialActive();
    }
}
window.customElements.define(AppscoTutorial.is, AppscoTutorial);
