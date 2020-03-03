import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-styles/shadow.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoProduct extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --layout-start;
                font-size: 16px;
                position: relative;
                color: var(--appsco-product-text-color, var(--primary-text-color));
                @apply --appsco-product;
            }
            paper-input {
                width: 220px;
                height: 30px;
                line-height: 30px;

                --paper-input-container: {
                    padding: 0;
                };
                --paper-input-container-input: {
                    font-size: 18px;
                };
                --paper-input-container-color: var(--appsco-product-text-color, var(--primary-text-color));
                --paper-input-container-input-color: var(--appsco-product-text-color, var(--primary-text-color));
                --paper-input-container-focus-color: var(--appsco-product-text-color, var(--primary-text-color));
                --paper-input-container-underline-focus: {
                    border-bottom: 1px solid var(--appsco-product-text-color, var(--primary-text-color));
                };
                --paper-input-prefix: {
                    color: var(--secondary-text-color);
                };

                @apply --appsco-product-search-input;
            }
            .input-icon {
                width: 18px;
                height: 18px;
            }
            paper-icon-button[suffix] {
                width: 20px;
                height: 20px;
                padding: 0;
                margin: 0;
                --iron-icon-fill-color: var(--appsco-product-text-color);
            }
            .product-list-action {
                cursor: pointer;
            }
            .filter {
                width: 100%;
                position: relative;
                z-index: 5;
                display: none;
            }
            .dropdown-content {
                @apply --shadow-elevation-2dp;
                padding: 0;
                position: absolute;
                top: 4px;
                left: 0;
                width: 100%;
                z-index: 5;
                overflow-y: auto;
                @apply --appsco-product-dropdown;
            }
            .paper-item {
                padding: 0 8px;
                height: 36px;
                line-height: 18px;
                font-size: 14px;
                cursor: pointer;
            }
            .paper-item:hover {
                @apply --paper-item-hover;
            }
            .product-active {
                font-size: 18px;
            }
        </style>

        <div hidden\$="[[ !_multiProducts ]]">

            <div id="activeProduct" class="product-active product-list-action" on-tap="_showPanelList" hidden\$="[[ _panelActive ]]">
                [[ _format(_selectedProduct.label) ]]
                <iron-icon icon="arrow-drop-down"></iron-icon>
            </div>

            <div id="searchPanel" hidden\$="[[ !_panelActive ]]">
                <paper-input id="searchPanelInput" placeholder="[[ _selectedProduct.label ]]" no-label-float="" on-focus="_onFilterPanelFocus" on-keyup="_onFilterPanelKeyup">

                    <template is="dom-if" if="[[ _clearPanelSearch ]]">
                        <paper-icon-button icon="clear" id="clearSearch" class="input-icon" suffix="" on-tap="_clearFilterPanel" slot="suffix"></paper-icon-button>
                    </template>
                </paper-input>
            </div>

            <div id="filterPanel" class="filter">

                <paper-listbox id="productList" class="dropdown-content" selected="[[ _selectedProduct.value ]]" attr-for-selected="value" on-iron-activate="_onItemActivate">

                    <template is="dom-repeat" items="[[ _productListDisplay ]]">
                        <paper-item class="paper-item" value="[[ item.value ]]" name="[[ item.name ]]" label="[[ item.label ]]" company="[[ item.company ]]">
                                [[ _format(item.label) ]]
                            <paper-ripple></paper-ripple>
                        </paper-item>
                    </template>

                </paper-listbox>

            </div>

        </div>

        <div hidden\$="[[ _multiProducts ]]">

            <span class="product-active">
                [[ _format(_selectedProduct.label) ]]
            </span>

        </div>`;
    }

    static get is() { return 'appsco-product'; }

    static get properties() {
        return {
            /** Indicates if user has access to Appsco Partner product. */
            partner: {
                type: Boolean,
                value: false,
                notify: true,
                observer: '_onPartnerChanged'
            },

            /** Indicates if user has access to Appsco Business product. */
            business: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            /** Appsco products. */
            _products: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _productListDisplay: {
                type: Array,
                value: function () {
                    return []
                }
            },

            _clearPanelSearch: {
                type: Boolean,
                value: false
            },

            _productToSelect: {
                type: String
            },

            _selectedProduct: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _multiProducts: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if user clicked on element or not.
             */
            _panelActive: {
                type: Boolean,
                value: false,
                observer: '_onFilterActiveChanged'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_setupProducts(_productToSelect, business)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'scale-up-animation',
                axis: 'y',
                transformOrigin: '0 0',
                node: this.shadowRoot.getElementById('filterPanel'),
                timing: {
                    delay: 50,
                    duration: 200
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.shadowRoot.getElementById('filterPanel'),
                timing: {
                    duration: 100
                }
            }
        };

        beforeNextRender(this, function() {
            this.set('_selectedProduct', this._products[0]);

            if (this.partner || this.business) {
                this._multiProducts = true;
            }
        });

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish.bind(this));
        gestures.add(document, 'tap', this._handleDocumentClick.bind(this));
    }

    _setupProducts(productToSelect, business) {
        if (this._products && business && business.length > 0) {
            const products = JSON.parse(JSON.stringify(this._products)),
                productsLength = products.length,
                length = business.length;

            for (let i = 0; i < length; i++) {
                for (let j = 0; j < productsLength; j++) {
                    if (products[j].company && (products[j].company.company.alias === business[i].company.alias)) {
                        products[j] = this._createNewBusinessProduct(business[i]);
                        break;
                    }
                    else if (j === productsLength - 1) {
                        products.push(this._createNewBusinessProduct(business[i]));
                    }
                }
            }

            products.sort(this._compareCompaniesByName);

            this.set('_products', []);
            this.set('_products', products);

            this.set('_productListDisplay', []);
            this.set('_productListDisplay', products);

            // paper-item doesn't display product name inside paper-listbox list without click event.
            document.body.click();

            this._multiProducts = true;
            this.setProduct(this._productToSelect);
        }
    }

    _format(value) {
        let result = '';
        if (value) {
            result = value;
            if (value.length > 20) {
                result = value.substring(0, 20) + '...';
            }

        }
        return result;
    }

    _isInPath(path, element) {
        path = path || [];

        for (let i = 0; i < path.length; i++) {
            if (path[i] == element) {
                return true;
            }
        }

        return false;
    }

    _handleDocumentClick(event) {
        const path = dom(event).path;

        if (!this._isInPath(path, this.shadowRoot.getElementById('activeProduct')) &&
            !this._isInPath(path, this.shadowRoot.getElementById('searchPanel')) &&
            !this._isInPath(path, this.shadowRoot.getElementById('filterPanel'))) {
            this._clearFilterPanel();
        }
    }

    _createPersonalProduct() {
        return {
            label: 'Personal',
            value: 'appsco-product',
            name: 'appsco-product',
            company: null
        };
    }

    setProduct(product) {
        const products = JSON.parse(JSON.stringify(this._products)),
            length = products.length;
        this.set('_productToSelect', product);

        if (length > 0) {
            for (let i = 0; i < length; i++) {
                if (product === products[i].value) {
                    // paper-listbox with id = 'productList'
                    // couldn't set proper selected value when '_selectedProduct' is changed
                    setTimeout(function() {
                        this.set('_selectedProduct', products[i]);
                        const productList = this.shadowRoot.getElementById('productList');
                        const selected = productList.selected;
                        productList.selected = undefined;
                        productList.selected = selected;
                    }.bind(this), 30);
                    break;
                }
            }
        }
        else {
            products.push(this._createPersonalProduct());

            this.set('_products', products);
            this.set('_productListDisplay',products);
            this.set('_selectedProduct', products[length]);
        }
    }

    removeProduct(product) {
        const products = JSON.parse(JSON.stringify(this._products)),
            length = products.length;

        for (let i = 0; i < length; i++) {
            if (products[i].value == product) {
                products.splice(i, 1);
                break;
            }
        }

        this.set('_products', []);
        this.set('_products', products);

        this.set('_productListDisplay', []);
        this.set('_productListDisplay', products);
    }

    removeProductCompanies(companies) {
        const length = companies.length;

        for (let i = 0; i < length; i++) {
            this.removeProduct('appsco-business-product' + companies[i].alias);
        }
    }

    addPersonalToProducts(product) {
        let products = JSON.parse(JSON.stringify(this._products)),
            length = products.length,
            alreadyExists = false;

        for (let i = 0; i < length; i++) {
            if ('appsco-product' === products[i].value) {
                alreadyExists = true;
                break;
            }
        }

        if (!alreadyExists) {
            products.unshift(this._createPersonalProduct());
        }

        this.set('_products', []);
        this.set('_products', products);
    }

    _onPartnerChanged(partner) {
        if (this._products && partner) {
            const products = JSON.parse(JSON.stringify(this._products)),
                productsLength = products.length;

            for (let i = 0; i < productsLength; i++) {
                if ('appsco-partner-product' === products[i].name) {
                    break;
                }
                else if (i === productsLength - 1) {
                    products.push(this._createNewPartnerProduct());
                }
            }

            this.set('_products', []);
            this.set('_products', products);

            this.set('_productListDisplay', []);
            this.set('_productListDisplay', products);

            // paper-item doesn't display product name inside paper-listbox list without click event.
            document.body.click();

            this._multiProducts = true;
            this.setProduct(this._productToSelect);
        }
    }

    _createNewPartnerProduct() {
        return {
            label: 'Partner',
            value: 'appsco-partner-product',
            name: 'appsco-partner-product',
            company: null
        };
    }

    _compareCompaniesByName(companyA, companyB) {
        if (!companyA.company) {
            return -1
        } else if (!companyB.company) {
            return 1;
        } else {
            companyA = companyA.company.company.name.toLowerCase();
            companyB = companyB.company.company.name.toLowerCase();
            return companyA < companyB ? -1 : companyA > companyB ? 1 : 0;
        }
    }

    _createNewBusinessProduct(company) {
        return {
            label: company.company.name,
            value: 'appsco-business-product' + company.company.alias,
            name: 'appsco-business-product',
            company: company
        };
    }

    /**
     * Listens to iron-activate event of product list.
     * It sets label of selected product to display.
     * It fires event that product is changed: appsco-product-changed.
     *
     * @private
     */
    _onItemActivate(event) {
        let item,
            productList = this.shadowRoot.getElementById('productList');

        this._clearFilterPanel();

        setTimeout(function() {
            productList.select(event.detail.selected);
            item = productList.selectedItem;
            this._selectedProduct = item;

            this.dispatchEvent(new CustomEvent('appsco-product-changed', {
                bubbles: true,
                composed: true,
                detail: {
                    product: item.name,
                    company: item.company
                }
            }));
        }.bind(this), 200);
    }

    _onFilterActiveChanged(active) {
        if (active) {
            this.shadowRoot.getElementById('searchPanelInput').focus();
        }
    }

    _onFilterPanelFocus() {
        this._clearPanelSearch = true;
    }

    _onFilterPanelKeyup(event) {
        const keyCode = event.keyCode,
            term = event.target.value ? event.target.value : '';

        if (40 === keyCode) {
            event.target.blur();
            this._focusFirstPanel();
            return false;
        }

        this._filterPanelListByTerm(term);
    }

    _clearFilterPanel() {
        const input = this.shadowRoot.getElementById('searchPanelInput');

        this._hidePanelList();

        setTimeout(function() {
            input.value = '';
            this._clearPanelSearch = false;
            this._filterPanelListByTerm('');
        }.bind(this), 100);
    }

    _focusFirstPanel() {
        this.shadowRoot.getElementById('productList').items[0].focus();
    }

    _filterPanelListByTerm(term) {
        const termLength = term.length,
            products = this._products,
            length = products.length;

        this.set('_productListDisplay', []);
        this.set('_clearPanelSearch', (termLength > 0));

        if (3 > termLength) {
            term = '';
        }

        for (let i = 0; i < length; i++) {
            const product = products[i];

            if (product && product.label.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                this.push('_productListDisplay', product);
            }
        }

        if (0 === this._productListDisplay.length && 3 <= termLength) {
            this.push('_productListDisplay', {
                label: 'There is no panel with asked name.',
                value: 'no_result'
            });
        }
    }

    _showPanelList() {
        this._panelActive = true;
        this.animationConfig.entry.node.style.display = 'block';
        this.playAnimation('entry');
    }

    _hidePanelList() {
        if (this._panelActive) {
            this.playAnimation('exit', {
                hidePanelSwitcher: true
            });
        }
    }

    _onNeonAnimationFinish(event) {
        if (event.detail.hidePanelSwitcher) {
            this.animationConfig.exit.node.style.display = 'none';
            this._panelActive = false;
        }
    }
}
window.customElements.define(AppscoProduct.is, AppscoProduct);
