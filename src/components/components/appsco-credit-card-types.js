import '@polymer/polymer/polymer-legacy.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCreditCardTypes extends PolymerElement {
    static get is() { return 'appsco-credit-card-types'; }

    static get properties() {
        return {
            types: {
                type: Array,
                value: function () {
                    return [];
                }
            }
        };
    }

    ready() {
        super.ready();

        this.types = this.ccTypes();
    }

    ccTypes() {
        return [
            {
                "code": 1,
                "name": "amex",
                "title": "American Express"
            },
            {
                "code": 2,
                "name": "mastercard",
                "title": "MasterCard"
            },
            {
                "code": 3,
                "name": "maestro",
                "title": "MasterCard Maestro"
            },
            {
                "code": 4,
                "name": "visa",
                "title": "Visa"
            },
            {
                "code": 5,
                "name": "visa_electron",
                "title": "Visa Electron"
            },
            {
                "code": 6,
                "name": "diners_club",
                "title": "Diners CLub"
            },
            {
                "code": 6,
                "name": "jcb",
                "title": "JCB"
            },
            {
                "code": 6,
                "name": "discover",
                "title": "Discover"
            }
        ]
    }
}
window.customElements.define(AppscoCreditCardTypes.is, AppscoCreditCardTypes);
