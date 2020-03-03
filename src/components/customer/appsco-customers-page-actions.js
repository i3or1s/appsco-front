import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../page/appsco-page-global.js';
import './appsco-customers-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomersPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                display: block;
            }
            :host .page-actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                height: 100%;
            }
            :host .page-actions * {
                height: 100%;
            }
        </style>

        <div class="page-actions">
            <appsco-customers-actions id="appscoCustomersActions" on-search-icon="_onSearchIcon" on-close-search="_onCloseSearch"></appsco-customers-actions>

            <appsco-page-global info=""></appsco-page-global>
        </div>
`;
    }

    static get is() { return 'appsco-customers-page-actions'; }

    static get properties() {
        return {
            _searchActive: {
                type: Boolean,
                value: false
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
                    delay: 200,
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
    }

    setupPage() {}

    resetPage() {
        this.shadowRoot.getElementById('appscoCustomersActions').reset();
    }

    resetPageActions() {
        this.shadowRoot.getElementById('appscoCustomersActions').resetActions();
    }

    showBulkActions() {
        this.shadowRoot.getElementById('appscoCustomersActions').showBulkActions();
    }

    hideBulkActions() {
        this.shadowRoot.getElementById('appscoCustomersActions').hideBulkActions();
    }

    showBulkSelectAll() {
        this.shadowRoot.getElementById('appscoCustomersActions').showBulkSelectAll();
    }

    hideBulkSelectAll() {
        this.shadowRoot.getElementById('appscoCustomersActions').hideBulkSelectAll();
    }

    _showSearch() {
        this.shadowRoot.getElementById('appscoCustomersActions').focusSearch();

        this.updateStyles({
            '--input-search-max-width': '100%',
            '--paper-input-search-container-tablet': 'width: 100%;'
        });
    }

    _closeSearch() {
        this._searchActive = false;

        this.updateStyles({'--input-search-max-width': '22px'});

        // Wait for animation to finish.
        setTimeout(function() {
            this.updateStyles({'--paper-input-search-container-tablet': 'width: auto'});
        }.bind(this), 200);

        this.updateStyles();
    }

    _onCloseSearch() {
        this._searchActive = false;

        this.updateStyles({'--input-search-max-width': '22px'});

        // Wait for animation to finish.
        setTimeout(function() {
            this.updateStyles({'--paper-input-search-container-tablet': 'width: auto'});
        }.bind(this), 200);

        this.updateStyles();
    }

    _onSearchIcon() {
        this._searchActive = !this._searchActive;
        this._searchActive ? this._showSearch() : this._closeSearch();
    }
}
window.customElements.define(AppscoCustomersPageActions.is, AppscoCustomersPageActions);
