import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-ajax/iron-request.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/access-on-boarding/appsco-access-on-boarding-roles.js';
import './components/access-on-boarding/appsco-access-on-boarding-page-filters.js';
import './components/access-on-boarding/appsco-access-on-boarding-page-actions.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccessOnBoardingPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --report-account-initials-background-color: var(--body-background-color-darker);
                --appsco-access-on-boarding-list-item: {
                    cursor: default;
                };
                --appsco-access-on-boarding-list-item-activated: {
                    @apply --shadow-elevation-2dp;
                };
            }
            :host div[resource] .resource-header, :host div[resource] .resource-actions {
                padding: 0;
            }
            :host div[resource] .resource-content {
                padding-top: 30px;
            }
            appsco-access-on-boarding-roles {
                --list-container: {
                    min-height: 60px;
                };
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">
            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-content">
                    <appsco-access-on-boarding-page-filters id="accessOnBoardingPageFilters" groups-api="[[ groupsApi ]]" authorization-token="[[ authorizationToken ]]" on-filter-access-on-boarding="_onFilterPageAction"></appsco-access-on-boarding-page-filters>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-access-on-boarding-roles id="appscoAccessOnBoardingRoles" type="access-on-boarding-user" size="100" load-more="" authorization-token="[[ authorizationToken ]]" list-api="[[ accessOnBoardingUsersApi ]]" api-errors="[[ apiErrors ]]" on-list-loaded="_onRolesLoadFinished" on-access-on-boarding-events-resolved="_onEventsResolved" on-list-empty="_onRolesLoadFinished">
                    </appsco-access-on-boarding-roles>
                </div>
            </div>

        </appsco-content>
`;
    }

    static get is() { return 'appsco-access-on-boarding-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            groupsApi: {
                type: String
            },

            accessOnBoardingUsersApi: {
                type: String
            },

            exportAccessOnBoardingApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, screen992)',
            '_toggleFilters(mobileScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
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

        beforeNextRender(this, function() {
            if (this.mobileScreen) {
                this.updateStyles();
            }
        });
        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
        this.toolbar.addEventListener('export-access-on-boarding', this._onExportAccessOnBoardingAction.bind(this));
    }

    _toggleFilters(mobile) {
        if (mobile) {
            this.hideResource();
        } else {
            this.showResource();
        }
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    showResource() {
        this.$.appscoContent.showSection('resource');
    }

    initializePage() {}

    resetPage() {
        this._reloadLists();
        this._resetFilters();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    reloadRoles() {
        this._reloadLists();
    }

    export() {
        const request = document.createElement('iron-request'),
            options = {
                method: 'GET',
                handleAs: 'blob',
                headers: {
                    'Authorization': 'token ' + this.authorizationToken
                }
            },
            filters = this._getAccessOnBoardingFilters();

        let url = this.exportAccessOnBoardingApi

        if (filters.group.alias && 'all' !== filters.group.alias) {
            url += (-1 < url.indexOf('?')) ?
                ('&group=' + filters.group.alias) :
                ('?group=' + filters.group.alias);
        }

        if (2 < filters.term.length) {
            url += (-1 < url.indexOf('?')) ?
                ('&term=' + filters.term) :
                ('?term=' + filters.term);
        }

        options.url = url;

        request.send(options).then(function() {
            const fileReader = new FileReader();

            fileReader.onload = function(event) {
                const link = document.createElement('a');

                link.href = event.target.result;
                link.setAttribute('download', 'AppsCo - Access On-boarding Status List.xlsx');
                document.body.appendChild(link);

                if (link.click) {
                    link.click();
                }
                else if (document.createEvent) {
                    const clickEvent = document.createEvent('MouseEvents');

                    clickEvent.initEvent('click', true, true);
                    link.dispatchEvent(clickEvent);
                }

                document.body.removeChild(link);
            };

            fileReader.readAsDataURL(request.response);

            this._hideProgressBar();
        }.bind(this), function() {
            this._hideProgressBar();
            this._notify('Export of Access On Boarding Report failed. Please contact AppsCo support.');
        }.bind(this));
    }

    _getAccessOnBoardingFilters() {
        return this.$.accessOnBoardingPageFilters.getFilters();
    }

    _updateScreen() {
        this.updateStyles();
    }

    _reloadLists() {
        this.$.appscoAccessOnBoardingRoles.reloadItems();
    }

    _resetFilters() {
        this.$.accessOnBoardingPageFilters.reset();
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onRolesLoadFinished() {
        this._onPageLoaded();
    }

    _onFilterPageAction(event) {
        this.$.appscoAccessOnBoardingRoles.filterRoles(event.detail.filters);
        this._showProgressBar();
    }

    _onEventsResolved(event) {
        this._notify((0 === event.detail.unresolvedItems.length) ?
            'Selected events have been resolved manually.' :
            'There was an error while resolving some events. Not all events were resolved.');
    }
    _onExportAccessOnBoardingAction() {
        this._showProgressBar();
        this.export();
    }
}
window.customElements.define(AppscoAccessOnBoardingPage.is, AppscoAccessOnBoardingPage);
