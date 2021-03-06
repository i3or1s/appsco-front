import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountSettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            @apply --appsco-account-settings;

            --paper-dropdown-menu: {
                 display: block;
             };
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
            .input-access {
                margin-top: 20px;
            }
            .input-upload-image {
                margin-top: 30px;
            @apply --layout-horizontal;
            @apply --layout-center;
            }
            .input-upload-image paper-input {
            @apply --layout-flex;

            --paper-input-container-underline: {
                 display: none;
             };
            --paper-input-container-underline-focus: {
                 display: none;
             };
            }
            .input-upload-image iron-image {
                margin-left: 20px;
            @apply --layout-flex-none;
            }
            .account-image {
                width: 64px;
                height: 64px;
            --iron-image-placeholder: {
                 background: #eeeeee;
             };
            }
            .input-container-profile-public {
                margin-top: 30px;
                margin-bottom: 10px;
            }

            .input-container-shared-resource {
                margin-top: 30px;
                margin-bottom: 10px;
            }

        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is saving application" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <iron-form id="accountSettingsForm" headers="{{ _headers }}" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
            <form method="POST" action="[[ accountSettingsApi ]]">
                <div class="input-container">
                    <paper-input id="firstName" name="profile[first_name]" label="First name" value="[[ account.first_name ]]"></paper-input>
                </div>

                <div class="input-container">
                    <paper-input id="lastName" name="profile[last_name]" label="Last name" value="[[ account.last_name ]]"></paper-input>
                </div>

                <div class="input-container">
                    <iron-ajax auto="" url="[[ _timeZoneListUrl ]]" handle-as="json" on-response="_onTimezoneListResponse">
                    </iron-ajax>

                    <paper-dropdown-menu id="dropdownTimezone" name="profile[timezone]" label="Timezone" horizontal-align="left">
                        <paper-listbox id="paperListboxTimezone" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _timezoneList ]]">
                                <paper-item value="[[ item.value ]]">[[ item.text ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>

                <div class="input-container">
                    <iron-ajax auto="" url="[[ _countryListUrl ]]" handle-as="json" on-response="_onCountryListResponse">
                    </iron-ajax>

                    <paper-dropdown-menu id="dropdownCountry" name="profile[country]" label="Country" horizontal-align="left">
                        <paper-listbox id="paperListboxCountry" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _countryList ]]">
                                <paper-item value="[[ item.code ]]">[[ item.name ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>

                <div class="input-container">
                    <paper-input id="phone" name="profile[phone]" label="Phone" value="[[ account.phone ]]"></paper-input>
                </div>

                <div class="input-container">
                    <paper-dropdown-menu id="dropdownGender" name="profile[gender]" label="Gender" horizontal-align="left">
                        <paper-listbox id="paperListboxGender" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _genderList ]]">
                                <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>

                <div class="input-container">
                    <paper-dropdown-menu id="dropdownCompanies" name="profile[default_company]" label="Default company dashboard" horizontal-align="left">
                        <paper-listbox id="paperListboxCompanies" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _companiesList ]]">
                                <paper-item value="[[ item.company.alias ]]">[[ item.company.name ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <p class="info">
                        The dashboard you choose will be set as your default dashboard upon login.
                    </p>
                </div>

                <div class="input-container">
                    <paper-dropdown-menu id="dropdownDefaultPage" name="profile[default_page]" label="Default company page" horizontal-align="left">
                        <paper-listbox id="paperListboxPages" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _pagesList ]]">
                                <paper-item value="[[ item.value ]]">[[ item.title ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <p class="info">
                        The page you choose will be set as the default page upon login.
                    </p>
                </div>


                <div class="input-container input-container-profile-public">
                    <paper-toggle-button id="publicAccountSwitch" name="profile[public]" checked\$="[[ _public ]]">Public profile</paper-toggle-button>

                    <template is="dom-if" if="[[ _public ]]">
                        <p class="info">
                            It is allowed for other AppsCo users to search for your profile and share applications with you.
                        </p>
                    </template>

                    <template is="dom-if" if="[[ !_public ]]">
                        <p class="info">
                            Activate Public Profile option if you want to allow other AppsCo users to search for your profile and share applications with you.
                        </p>
                    </template>
                </div>
            </form>
        </iron-form>

        <iron-form id="accountEmailNotificationsForm" headers="{{ _headers }}" on-iron-form-presubmit="_onEmailNotificationsFormPresubmit" on-iron-form-response="_onEmailNotificationsFormResponse">
            <form method="PUT" action="[[ accountEmailNotificationsApi ]]">
                <div class="input-container input-container-shared-resource">
                    <paper-toggle-button id="sharedResourceNotifications" name="notification_settings[notifications][0]" checked\$="[[ _sharedResourceNotifications ]]">Shared resource notifications
                    </paper-toggle-button>
                    <p class="info">
                        Receive email notifications when a resource is shared to you.
                    </p>
                </div>
            </form>
        </iron-form>

        <paper-button id="submit" class="submit-button" on-tap="_submitAccountSettingsForm">Save</paper-button>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-account-settings'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {}
                },
                notify: true,
                observer: '_onAccountChange'
            },

            _companiesList: {
                type: Array,
                computed: '_computeCompaniesList(account)'
            },

            _pagesList: {
                type: Array,
                value: function () {
                    return [
                        {title: 'Dashboard', value: 'dashboard'},
                        {title: 'Resources', value: 'resources'},
                        {title: 'AppsCo HR', value: 'appsco-one-hr'}
                    ]
                }
            },

            _localeList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'English',
                            value: 'en'
                        },
                        {
                            name: 'Norwegian',
                            value: 'no'
                        }
                    ];
                }
            },

            _timezoneList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _genderList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'Male',
                            value: 'm'
                        },
                        {
                            name: 'Female',
                            value: 'f'
                        }
                    ];
                }
            },

            _public: {
                type: Boolean,
                computed: '_computedPublicState(account)'
            },

            /**
             * Country list to get name of country from.
             * Country code = account.country.
             *
             * This is loaded from local data/country-list.json.
             */
            _countryList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _sharedResourceNotifications: {
                type: Boolean,
                computed: '_computeSharedResourceNotifications(account)'
            },

            accountSettingsApi: {
                type: String
            },

            accountEmailNotificationsApi: {
                computed: '_computeAccountEmailNotificationsApi(accountSettingsApi)'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _target: {
                type: Object
            },

            _timeZoneListUrl: {
                type: String,
                value: function () {
                    return this.resolveUrl('./data/timezone-list.json');
                }
            },

            _countryListUrl: {
                type: String,
                value: function () {
                    return this.resolveUrl('./data/country-list.json');
                }
            }
        };
    }

    static get importMeta() {
        return import.meta;
    }

    ready() {
        super.ready();

        this._target = this.$.accountSettingsForm;
    }

    _computedPublicState(account) {
        return account.profile_options && account.profile_options.public;
    }

    _onAccountChange(account) {
        if (account) {
            this.$.paperListboxTimezone.select(account.timezone);
            this.$.paperListboxCountry.select(account.country);
            this.$.paperListboxGender.select(account.gender);
            this.$.paperListboxCompanies.select(account.default_company ? account.default_company.alias : '');
            this.$.paperListboxPages.select(
                (account.profile_options && account.profile_options.default_company_page)
                    ? account.profile_options.default_company_page
                    : ''
            );
        }
    }

    _onCountryListResponse(event, ironRequest) {
        const response = ironRequest.response;

        this._countryList = response.sort(function(countryA, countryB) {
            countryA = countryA.name.toLowerCase();
            countryB = countryB.name.toLowerCase();

            return countryA < countryB ? -1 : countryA > countryB ? 1 : 0;
        });
    }

    _onTimezoneListResponse(event, ironRequest) {
        const response = [];

        ironRequest.response.forEach(function(zone, i) {
            if (zone.utc) {
                zone.utc.forEach(function(utc, index) {
                    const item = {
                        value: utc,
                        text: utc.split('/')[1]
                    };

                    response.push(item);
                }.bind(this));
            }
        }.bind(this));

        this._timezoneList = response.sort(function(zoneA, zoneB) {
            zoneA = zoneA.text.toLowerCase();
            zoneB = zoneB.text.toLowerCase();

            return zoneA < zoneB ? -1 : zoneA > zoneB ? 1 : 0;
        });
    }

    _onUploadImage(event) {
        const input = event.target;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                this.$.accountImage.src = e.target.result;
            }.bind(this);

            reader.readAsDataURL(input.files[0]);
        }
    }

    _onEnter() {
        this._submitAccountSettingsForm();
    }

    _submitAccountSettingsForm() {
        this.$.accountSettingsForm.submit();
    }

    _onFormPresubmit() {
        this._loader = true;

        this.$.accountSettingsForm.request.method = 'put';
        this.$.accountSettingsForm.request.body['profile[timezone]'] = this.$.dropdownTimezone.selectedItem ? this.$.dropdownTimezone.selectedItem.value : '';
        this.$.accountSettingsForm.request.body['profile[country]'] = this.$.dropdownCountry.selectedItem ? this.$.dropdownCountry.selectedItem.value : '';
        this.$.accountSettingsForm.request.body['profile[gender]'] = this.$.dropdownGender.selectedItem ? this.$.dropdownGender.selectedItem.value : '';
        this.$.accountSettingsForm.request.body['profile[default_company]'] = this.$.dropdownCompanies.selectedItem ? this.$.dropdownCompanies.selectedItem.value : '';
        this.$.accountSettingsForm.request.body['profile[default_page]'] = this.$.dropdownDefaultPage.selectedItem ? this.$.dropdownDefaultPage.selectedItem.value : '';

        if (this.$.publicAccountSwitch.checked) {
            this.$.accountSettingsForm.request.body['profile[public]'] = true;
        }
    }

    _onEmailNotificationsFormPresubmit () {
        this._loader = true;
        this.$.accountEmailNotificationsForm.request.body = [];

        if (this.$.sharedResourceNotifications.checked) {
            this.$.accountEmailNotificationsForm.request.body['notification_settings[notifications][0]'] = true;
        }
    }

    _onFormError(event) {
        this._errorMessage = event.detail.error.message;
        this._loader = false;
    }

    _onFormResponse(event) {
        const account = event.detail.response.account;
        this.set('account', account);

        this.$.accountEmailNotificationsForm.submit();
    }

    _onEmailNotificationsFormResponse(event) {
        this.account.notificationSettings = event.detail.response.notification_settings;

        this.set('account', this.account);

        this.dispatchEvent(new CustomEvent('settings-saved', {
            bubbles: true,
            composed: true,
            detail: {
                account: this.account
            }
        }));

        this._loader = false;
    }

    setUp() {
        this.$.firstName.focus();
    }

    reset() {
        const account = JSON.parse(JSON.stringify(this.account));

        this.account = {};
        this.account = account;

        this._errorMessage = '';
    }

    _computeCompaniesList(changedAccount) {
        const account = JSON.parse(JSON.stringify(changedAccount));
        const personal = {
            company: {
                alias: '',
                name: 'Default'
            }
        };
        const companies = account && account.companies && account.companies.length > 0 ? account.companies : [];
        companies.unshift(personal);
        return companies;
    }

    _computeAccountEmailNotificationsApi(accountSettingsApi) {
        return accountSettingsApi ? accountSettingsApi + '/notification-settings' : null;
    }

    _computeSharedResourceNotifications (account) {
        return account.notificationSettings && account.notificationSettings['shared_resource'] ? account.notificationSettings['shared_resource'] : false;
    }
}
window.customElements.define(AppscoAccountSettings.is, AppscoAccountSettings);
