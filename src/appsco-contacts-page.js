import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/account/appsco-contacts.js';
import './components/account/appsco-invitations.js';
import './components/components/appsco-search.js';
import './components/group/appsco-company-groups.js';
import './components/account/appsco-account-image.js';
import './components/account/appsco-account-details.js';
import './components/account/appsco-account-log.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import './components/contact/appsco-contacts-page-actions.js';
import './components/contact/appsco-import-contacts.js';
import './components/contact/appsco-add-contact.js';
import './components/contact/appsco-delete-contacts.js';
import './components/group/appsco-resource-add-groups.js';
import './components/notifications/appsco-send-notification.js';
import './components/account/appsco-invitation-remove.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContactsPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --account-details-label: {
                    font-size: 12px;
                };
                --account-details-value: {
                    font-size: 14px;
                };

                --account-log-appsco-list-item: {
                    padding-top: 14px;
                    padding-bottom: 8px;
                };

                --item-basic-info: {
                    padding: 0 10px;
                };

                --appsco-account-log-container: {
                    padding-top: 0;
                };
            }
            :host div[resource] .resource-content {
                padding-top: 20px;
            }
            paper-tabs {
                height: 32px;
                @apply --layout-flex-none;
            }
            .paper-tabs-pages {
                @apply --paper-tabs-pages;
            }
            .tab-content {
                margin-top: 20px;
                @apply --paper-tabs-content-style;
            }
            appsco-company-groups {
                margin-top: 20px;

                --appsco-company-group-item: {
                    padding: 4px;
                    margin-bottom: 5px;
                };
            }
            appsco-account-image {
                --account-image: {
                    width: 32px;
                    height: 32px;
                    margin-right: 5px;
                };

                --account-initials-background-color: var(--body-background-color-darker);
                --account-initials-font-size: 14px;
            }
            :host .account-name {
                @apply --paper-font-subhead;
                font-size: 18px;
            }
            :host([screen992]) {
                --account-basic-info: {
                    width: 140px;
                };
                --account-basic-info-values: {
                    width: 140px;
                };

                --account-auth-type-info: {
                    width: 140px;
                };
                --account-auth-type-info-values: {
                    width: 140px;
                };
            }
            neon-animated-pages .iron-selected:not(.neon-animating) {
                position: relative; 
            }
        </style>

        <iron-media-query query="(max-width: 992px)" query-matches="{{ screen992 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-header">
                    Groups
                </div>

                <div class="resource-content">
                    <appsco-search id="appscoSearch" label="Search groups" on-search="_onSearchGroups" on-search-clear="_onSearchGroupsClear"></appsco-search>

                    <appsco-company-groups id="appscoCompanyGroups" list-api="[[ groupsApi ]]" authorization-token="[[ authorizationToken ]]" size="100" type="group" preview="" selectable="" on-item="_onGroupSelected"></appsco-company-groups>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">

                    <neon-animated-pages selected="[[ _page ]]" attr-for-selected="name" entry-animation="fade-in-animation" exit-animation="fade-out-animation" on-neon-animation-finish="_onPageAnimationFinished">

                        <appsco-invitations id="appscoInvitations" name="invitations" size="100" authorization-token="[[ authorizationToken ]]" invitations-api="[[ companyInvitationsApi ]]" type="contact" on-remove="_onRemoveInvitationAction" on-loaded="_onInvitationsLoaded" on-empty-load="_onInvitationsEmptyLoad" on-invitation-resent="_onContactInvitationResent" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange"></appsco-invitations>

                        <appsco-contacts id="appscoContacts" name="contacts" type="contact" size="100" load-more="" selectable="" authorization-token="[[ authorizationToken ]]" list-api="[[ companyContactsApi ]]" on-list-loaded="_onContactsLoaded" on-list-empty="_onContactsEmptyLoad" on-item="_onContactAction" on-edit-item="_onEditContactAction" on-select-item="_onSelectContactAction" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange"></appsco-contacts>
                    </neon-animated-pages>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <appsco-account-image account="[[ _account ]]"></appsco-account-image>
                    <span class="account-name flex">[[ contact.display_name ]]</span>
                </div>

                <div class="info-content flex-vertical">

                    <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                        <paper-tab name="info">Info</paper-tab>
                        <paper-tab name="log">Log</paper-tab>
                    </paper-tabs>

                    <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                        <div name="info" class="tab-content details">
                            <appsco-account-details account="[[ _account ]]"></appsco-account-details>
                        </div>

                        <div name="log" class="tab-content log">
                            <appsco-account-log id="accountLog" log-api="[[ contact.meta.log ]]" authorization-token="[[ authorizationToken ]]" size="5" short-view=""></appsco-account-log>
                        </div>

                    </neon-animated-pages>

                </div>
            </div>

        </appsco-content>

        <appsco-add-contact id="appscoAddContact" authorization-token="[[ authorizationToken ]]" add-contact-api="[[ companyContactsApi ]]" add-invitation-api="[[ companyInvitationsApi ]]" api-errors="[[ apiErrors ]]" on-contact-created="_onContactCreated" on-invitation-created="_onInvitationCreated">
        </appsco-add-contact>

        <appsco-import-contacts id="appscoImportContacts" authorization-token="[[ authorizationToken ]]" import-api="[[ importContactsApi ]]" domain="[[ domain ]]" on-import-finished="_onImportContactsFinished">
        </appsco-import-contacts>

        <appsco-delete-contacts id="appscoContactsRemove" contacts="[[ _selectedContacts ]]" company-api="[[ companyApi ]]" authorization-token="[[ authorizationToken ]]" on-contacts-removed="_onDeletedContacts" on-contacts-remove-failed="_onDeleteContactsFailed">
        </appsco-delete-contacts>

        <appsco-resource-add-groups id="appscoShareToGroupDialog" authorization-token="[[ authorizationToken ]]" groups-api="[[ groupsApi ]]">
        </appsco-resource-add-groups>

        <appsco-send-notification id="appscoSendNotification" authorization-token="[[ authorizationToken ]]" company-notifications-api="[[ companyNotificationsApi ]]" get-roles-api="[[ companyRolesApi ]]" get-contacts-api="[[ companyContactsApi ]]" api-errors="[[ apiErrors ]]" on-notification-sent="_onNotificationSent">
        </appsco-send-notification>

        <appsco-invitation-remove id="appscoInvitationRemove" authorization-token="[[ authorizationToken ]]" on-invitation-removed="_onInvitationRemoved" on-invitation-already-removed="_onInvitationAlreadyRemoved" disable-upgrade\$="[[!_applicationsApi]]">
        </appsco-invitation-remove>
`;
    }

    static get is() { return 'appsco-contacts-page'; }

    static get properties() {
        return {
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

            screen992: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            contact: {
                type: Object,
                value: function () {
                    return {}
                },
                observer: '_onContactChanged'
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            companyInvitationsApi: {
                type: String
            },

            companyContactsApi: {
                type: String
            },

            groupsApi: {
                type: String
            },

            companyApi: {
                type: String
            },

            companyRolesApi: {
                type: String
            },

            companyNotificationsApi: {
                type: String
            },

            importContactsApi: {
                type: String
            },

            _account: {
                type: Object,
                computed: '_computeAccount(contact)'
            },

            _contactExists: {
                type: Boolean,
                computed: '_computeContactExistence(contact)'
            },

            _contactsLoaded: {
                type: Boolean,
                value: false
            },

            _invitationsLoaded: {
                type: Boolean,
                value: false
            },

            _pageReady: {
                type: Boolean,
                computed: '_computePageReadyState(_contactsLoaded, _invitationsLoaded)',
                observer: '_onPageReadyChanged'
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _page: {
                type: String,
                value: 'contacts'
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _selectedContacts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _selectedTab: {
                type: Number
            },

            _contactSelectAction: {
                type: Number,
                value: 0
            },

            apiErrors: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, screen992)',
            '_hideFilters(mobileScreen)'
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
            this.set('_itemsComponent', this.$.appscoContacts);
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('search', this._onSearchContacts.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchContactsClear.bind(this));
        this.toolbar.addEventListener('add-contact', this._onAddContactAction.bind(this));
        this.toolbar.addEventListener('import-contacts', this._onImportContactsAction.bind(this));
        this.toolbar.addEventListener('select-all-contacts', this._onSelectAllContactsAction.bind(this));
        this.toolbar.addEventListener('delete-contacts', this._onDeleteContactsAction.bind(this));
        this.toolbar.addEventListener('add-groups-to-contacts', this._onAddGroupsToContactsAction.bind(this));
        this.toolbar.addEventListener('send-notification', this._onSendNotificationToContacts.bind(this));
        this.toolbar.addEventListener('page-selected', this._onPageSelected.bind(this));
    }

    pageSelected() {
        this._showContacts();
        this.reloadInvitations();
        this.reloadContacts();
    }

    _onObservableItemListChange(event, data) {
        if(data.type === this._page) {
            this.setObservableType('contact-page');
            this.populateItems(data.items);
        }
        event.stopPropagation();
    }

    _hideFilters(mobile) {
        if (mobile) {
            this.hideResource();
        }
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    showPage(page) {
        this._page = page;
    }

    toggleInfo() {
        if (this._contactExists) {
            this.$.appscoContent.toggleSection('info');
            this._infoShown = !this._infoShown;

            if (this._infoShown) {
                this._selectedTab = 0;
            }
            else {
                this.$.appscoContacts.deactivateItem(this.contact);
                this._setDefaultContact();
            }
        }
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    _setDefaultContact() {
        this.set('contact', this.$.appscoContacts.getFirstItem());
    }

    addContacts(contacts) {
        this.$.appscoContacts.addItems(contacts);
    }

    modifyContacts(contacts) {
        this.$.appscoContacts.modifyItems(contacts);
    }

    removeContacts(contacts) {
        this.$.appscoContacts.removeItems(contacts);
        this._setDefaultContact();
    }

    reloadContactsAndActions() {
        this._resetPageActions();
        this._reloadContacts();
    }

    addInvitations(invitations) {
        this.$.appscoInvitations.addInvitations(invitations);
    }

    removeInvitations(invitations) {
        this.$.appscoInvitations.removeInvitations(invitations);
    }

    reloadInvitations() {
        this._resetPageActions();
        this._invitationsLoaded = false;
        this.$.appscoInvitations.reloadInvitations();
    }

    filterByTerm(term, page) {
        page = page ? page : this._page;

        switch (page) {
            case 'contacts':
                this.$.appscoContacts.filterByTerm(term);
                break;

            case 'invitations':
                this.$.appscoInvitations.filterByTerm(term);
                break;

            default:
                return false;
        }
    }

    getSelectedContacts() {
        return this.$.appscoContacts.getSelectedItems();
    }

    addGroup(group) {
        this.$.appscoCompanyGroups.addItems([group]);
    }

    removeGroup(group) {
        this.removeGroups([group]);
    }

    removeGroups(groups) {
        this.$.appscoCompanyGroups.removeItems(groups);
    }

    modifyGroups(groups) {
        this.$.appscoCompanyGroups.modifyItems(groups);
    }

    resetGroupSelection() {
        this.$.appscoCompanyGroups.reset();
    }

    hideBulkActions() {
        this._hideBulkActions();
    }

    initializePage() {
        this._setDefaultContact();
    }

    reloadContacts() {
        this._reloadContacts();
    }

    resetPage() {
        this._resetPageLists();
        this._resetFilter();
        this._resetPageActions();
        this._showContacts();
        this.hideInfo();
    }

    _resetFilter () {
        this._onSearchGroupsClear();
        this.$.appscoCompanyGroups.reset();
    }

    _resetPageActions() {
        this.toolbar.resetPageActions();
    }

    _resetPageLists() {
        this._deselectAllItems();
        this.$.appscoContacts.reset();
        this.$.appscoInvitations.reset();
    }

    _computeAccount(contact) {
        return contact.account ? contact.account : {};
    }

    _computeContactExistence(contact) {
        return Object.keys(contact).length > 0;
    }

    _computePageReadyState(contacts, invitations) {
        return contacts && invitations;
    }

    _updateScreen() {
        this.updateStyles();
    }

    _loadLog() {
        this.$.accountLog.loadLog();
    }

    _onContactChanged(contact) {
        if (contact.meta && contact.meta.log) {
            this._loadLog();
        }
    }

    _reloadContacts() {
        this._contactsLoaded = false;
        this.$.appscoContacts.reloadItems();
    }

    _onInvitationsLoaded() {
        this._invitationsLoaded = true;
    }

    _onInvitationsEmptyLoad() {
        this._invitationsLoaded = true;
    }

    _onRemoveInvitationAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoInvitationRemove');
        dialog.setInvitation(event.detail.invitation);
        dialog.open();
    }

    _onContactsLoaded() {
        this._contactsLoaded = true;
        this._setDefaultContact();
    }

    _onContactsEmptyLoad() {
        this._contactsLoaded = true;
    }

    _onPageReadyChanged(pageReady) {
        if (pageReady) {
            this._onPageLoaded();
        }
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _showContacts() {
        this._page = 'contacts';
    }

    _searchGroups(term) {
        this.$.appscoCompanyGroups.filterByTerm(term);
    }

    _onSearchGroups(event) {
        this._searchGroups(event.detail.term);
    }

    _onSearchGroupsClear() {
        this.$.appscoSearch.reset();
        this._searchGroups('');
    }

    _loadContactsForGroup(group) {
        this.$.appscoContacts.filterByGroup(group);
    }

    _onGroupSelected(event) {
        this._loadContactsForGroup(event.detail.item);
    }

    _onContactAction(event) {

        if (event.detail.item.activated) {
            this._onViewInfo(event);
        }
        else {
            this.hideInfo();
            this._setDefaultContact();
        }
    }

    _onSelectContactAction(event) {
        const contact = event.detail.item;

        clearTimeout(this._contactSelectAction);

        this._contactSelectAction = setTimeout(function() {
            if (contact.selected) {
                this._showBulkActions();
            }
            else {
                const selectedContact = this.$.appscoContacts.getFirstSelectedItem();
                for (const key in selectedContact) {
                    return false;
                }

                this._hideBulkActions();
            }
        }.bind(this), 10);
        this._handleItemsSelectedState();
    }

    _onEditContactAction(event) {
        this.dispatchEvent(new CustomEvent('edit-contact', {
            bubbles: true,
            composed: true,
            detail: {
                contact: event.detail.item
            }
        }));
    }

    _showInfo() {
        if (this._contactExists) {
            this.$.appscoContent.showSection('info');
            this._infoShown = true;
            this._selectedTab = 0;
        }
    }

    _handleInfo(contact) {
        this.set('contact', contact);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onViewInfo(event) {
        this._handleInfo(event.detail.item);
    }

    _onPageAnimationFinished() {
        this._resetPageActions();
        this._resetPageLists();
    }

    _searchContacts(term) {
        this._showProgressBar();
        this.filterByTerm(term);
    }

    _onSearchContacts(event) {
        this._searchContacts(event.detail.term);
    }

    _onSearchContactsClear() {
        this._searchContacts('');
    }

    _onAddContactAction() {
        this.shadowRoot.getElementById('appscoAddContact').toggle();
    }

    _onContactCreated(event) {
        const contact = event.detail.contact;

        this.addContacts([contact]);
        this._notify('Contact ' + contact.email + ' was successfully added.');
    }

    _onImportContactsAction() {
        this.shadowRoot.getElementById('appscoImportContacts').toggle();
    }

    _onImportContactsFinished(event) {
        const response = event.detail.response;
        let message = response.numberOfContacts + ' contacts imported out of ' + response.total + '.'
            + ' Number of invitations created: ' + response.numberOfInvitations + '.'
            + ' Number of failed imports: ' + response.numberOfFailed + '.';

        if (0 < response.numberOfContacts) {
            this.reloadContactsAndActions();
        }

        if (0 < response.numberOfInvitations) {
            this.reloadInvitations();
        }

        this._notify(message, true);
        this._hideProgressBar();
        this.dispatchEvent(new CustomEvent('reload-account-log', { bubbles: true, composed: true }));
    }

    _onSelectAllContactsAction() {
        this.selectAllItems();
    }

    _onDeleteContactsAction() {
        const selectedContacts = this.getSelectedContacts();

        if (selectedContacts.length > 0) {
            this.set('_selectedContacts', selectedContacts);
            this.shadowRoot.getElementById('appscoContactsRemove').toggle();
        }
        else {
            this._onHideContactBulkActions();
        }
    }

    _onDeletedContacts() {
        this.removeContacts(this._selectedContacts);
        this.hideBulkActions();
        this._notify('Selected contacts were successfully removed from company.');
    }

    _onDeleteContactsFailed() {
        this.set('_selectedContacts', []);
        this._notify('An error occurred. Selected contacts were not removed from company. Please try again.');
    }

    _onAddGroupsToContactsAction() {
        const selectedContacts = this.getSelectedContacts();
        if (0 === selectedContacts.length) {
            return;
        }

        const dialog = this.shadowRoot.getElementById('appscoShareToGroupDialog');
        dialog.setItems(selectedContacts);
        dialog.setType('contact');
        dialog.open();
    }

    _onSendNotificationToContacts() {
        const dialog = this.shadowRoot.getElementById('appscoSendNotification');
        dialog.setFilterType('contact');
        dialog.toggle();
        this._hideProgressBar();
    }

    _onNotificationSent(event) {
        this._notify('Notification successfully sent to '+ event.detail.counter +' accounts.');
    }

    _onPageSelected(event) {
        this.showPage(event.detail.page.toLowerCase());
    }

    _onContactInvitationResent(event) {
        this._notify('Invitation for contact ' + event.detail.invitation.email + ' has been sent.');
    }

    _onInvitationCreated(event) {
        const invitation = event.detail.invitation;
        this.addInvitations([invitation]);
        this._notify('Invitation for account ' + invitation.email + ' was successfully created and can be found under invitations.');
    }

    _onInvitationRemoved(event) {
        const invitation = event.detail.invitation;
        this.removeInvitations([invitation]);
        this._notify('Invitation for account ' + invitation.email + ' has been removed.');
    }

    _onInvitationAlreadyRemoved(event) {
        const invitation = event.detail.invitation;
        this.removeInvitations([invitation]);
        this._notify('Invitation for account ' + invitation.email + ' has already been removed.');
    }
}
window.customElements.define(AppscoContactsPage.is, AppscoContactsPage);
