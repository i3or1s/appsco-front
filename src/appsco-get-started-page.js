import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-ajax/iron-request.js';
import './components/get-started/appsco-tutorial-card.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoGetStartedPage extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host .tutorials-holder {
                margin-left: 12%;
                margin-right: 12%;
            }
            :host .get-started-header {
                margin-bottom: 20px;
            }
            :host .get-started-header h1 {
                text-align: center;
                font-size: 26px;
                border-bottom: 1px solid #CCC;
                padding-bottom: 10px;
            }
            :host .get-started-header p {
                text-align: center;
                margin: 0;
                padding: 2px;
            }
        </style>

        <appsco-content id="appscoContent">

            <div content="">
                <div class="content-container">

                    <div class="get-started-header">
                        <h1>Welcome to AppsCo Business!</h1>
                        <p>Let's guide you through the company setup.</p>
                        <p>Take your time - we'll keep the menu active and save your progress until you're done.</p>
                    </div>

                    <div class="tutorials-holder">
                        <template is="dom-repeat" items="[[ tutorialsArray ]]">
                            <appsco-tutorial-card tutorial="[[ item ]]" index="[[ index ]]" first-unfinished-index="[[ firstUnfinishedIndex ]]" on-start="_onTutorialStart"></appsco-tutorial-card>
                        </template>
                    </div>
                </div>
            </div>

        </appsco-content>
`;
    }

    static get is() { return 'appsco-get-started-page'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {}
                }
            },

            tutorials: {
                type: Object,
                notify: true,
                observer: "_tutorialsChanged"
            },

            tutorialsArray: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            firstUnfinishedIndex: {
                type: Number,
                computed: '_computeFirstUnfinishedIndex(tutorials)'
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
            this._pageLoaded();
        });
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _computeTutorialsArray(tutorials) {
        var tutsArray = [];
        for(var idx in tutorials) {
            if (tutorials.hasOwnProperty(idx)) {
                tutsArray.push({
                    id: tutorials[idx].getId(),
                    tutorialTitle: tutorials[idx].tutorialTitle,
                    icon: tutorials[idx].icon,
                    description: tutorials[idx].description,
                    readme: tutorials[idx].readme,
                    isDone: tutorials[idx].isDone()
                });
            }
        }

        return tutsArray;
    }

    _tutorialsChanged(tutorials) {
        this.set('tutorialsArray', []);
        this.set('tutorialsArray', this._computeTutorialsArray(tutorials));
    }

    _computeFirstUnfinishedIndex(tutorials) {
        var index = 0;
        for (var idx in this.tutorials) {
            if (this.tutorials.hasOwnProperty(idx) && !(tutorials[idx].isDone())) {
                return index;
            }
            index++;
        }

        return index;
    }
}
window.customElements.define(AppscoGetStartedPage.is, AppscoGetStartedPage);
