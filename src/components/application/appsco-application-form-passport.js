import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-country-list.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationFormPassport extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
    static get template() {
        return html`
        <appsco-country-list types="{{ _countryList }}"></appsco-country-list>

        <div class="form-left">

            <div class="input-container">

                <paper-dropdown-menu data-field="choice" id="country" label="Country" name\$="[[ claimsNamePrefix ]][country]" horizontal-align="left">
                    <paper-listbox id="paperListboxCountry" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                        <template is="dom-repeat" items="[[ _countryList ]]">
                            <paper-item value="[[ item.code ]]">[[ item.name ]]</paper-item>
                        </template>
                    </paper-listbox>
                </paper-dropdown-menu>

            </div>

            <div class="input-container">
                <paper-input id="number" data-field="" name\$="[[ claimsNamePrefix ]][number]" label="Number" value="[[ claims.number ]]"></paper-input>
            </div>

            <div class="input-container">
                <paper-input id="nationality" data-field="" name\$="[[ claimsNamePrefix ]][nationality]" label="Nationality" value="[[ claims.nationality ]]"></paper-input>
            </div>

            <div class="input-container">
                <div class="input-container">
                    <paper-dropdown-menu id="sex" data-field="choice" name\$="[[ claimsNamePrefix ]][sex]" label="Gender" horizontal-align="left">
                        <paper-listbox id="paperListboxGender" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                            <template is="dom-repeat" items="[[ _genders ]]">
                                <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
            </div>
        </div>

        <div class="form-right">
            <div class="input-container">
                <paper-input id="issuingAuthority" data-field="" name\$="[[ claimsNamePrefix ]][issuingAuthority]" label="Issuing authority" value="[[ claims.issuingAuthority ]]"></paper-input>
            </div>

            <div class="input-container date-container">
                <vaadin-date-picker id="dateOfBirth" data-field="" name\$="[[ claimsNamePrefix ]][dateOfBirth]" label="Date of birth" value="[[ claims.dateOfBirth ]]"></vaadin-date-picker>
            </div>

            <div class="input-container date-container">
                <vaadin-date-picker id="issuedDate" data-field="" name\$="[[ claimsNamePrefix ]][issuedDate]" label="Issue date" value="[[ claims.issuedDate ]]"></vaadin-date-picker>
            </div>

            <div class="input-container date-container">
                <vaadin-date-picker id="expirationDate" data-field="" label="Expiration date" name\$="[[ claimsNamePrefix ]][expirationDate]" value="[[ claims.expirationDate ]]"></vaadin-date-picker>
            </div>

            <div class="input-container">
                <paper-textarea id="note" rows="3" data-field="" label="Note" value="[[ claims.note ]]" name\$="[[ claimsNamePrefix ]][note]"></paper-textarea>
            </div>
        </div>

        <iron-a11y-keys keys="enter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-application-form-passport'; }

    static get properties() {
        return {
            claims: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: "_onClaimsChange"
            },

            _countryList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _genders: {
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

            claimsNamePrefix: {
                type: String,
                value: "claims_passport"
            }
        };
    }

    reset() {
        dom(this.root).querySelectorAll('[data-field]').forEach(function(item, key) {
            item.value = this.claims[item.getAttribute('id')] ? this.claims[item.getAttribute('id')] : '';
            item.invalid = false;
        }.bind(this));

        dom(this.root).querySelectorAll('paper-listbox').forEach(function(item, key) {
            item.selected = -1;
        });
    }

    _onClaimsChange() {
        if(this.claims) {
            this.$.paperListboxCountry.select(this.claims.country);
            this.$.paperListboxGender.select(this.claims.sex);
        }
    }
}
window.customElements.define(AppscoApplicationFormPassport.is, AppscoApplicationFormPassport);
