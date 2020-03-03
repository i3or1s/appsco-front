import '@polymer/polymer/polymer-legacy.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

/**
 * @polymerBehavior
 */
export const AppscoListItemBehavior = {
    properties: {

        item: {
            type: Object,
            value: function() {
                return {};
            },
            observer: '_onItemChanged'
        },

        type: {
            type: String,
            value: ''
        },

        selectable: {
            type: Boolean,
            value: false
        },

        noAutoDisplay: {
            type: Boolean,
            value: false
        },

        _orgUnits: {
            type: String,
            computed: '_computeOrganizationUnits(item, type)'
        },

        _groups: {
            type: String,
            computed: '_computeGroups(item, type)'
        },

        activated: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
        },

        selected: {
            type: Boolean,
            value: false,
            reflectToAttribute: true,
            observer: '_onSelectedChanged'
        },

        hoverDisabled: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
        },

        /**
         * Animation for loader appearance.
         */
        animationConfig: {
            value: function() {
                return {
                    'entry': {
                        name: 'fade-in-animation',
                        node: this,
                        timing: {
                            duration: 200
                        }
                    },
                    'exit': {
                        name: 'fade-out-animation',
                        node: this,
                        timing: {
                            duration: 100
                        }
                    }
                }
            }
        }
    },

    listeners: {
        'neon-animation-finish': '_onNeonAnimationFinished'
    },

    attached: function() {
        afterNextRender(this, function() {
            if (!this.noAutoDisplay) {
                this._showItem();
            }
        });
    },

    _showItem: function() {
        this.style.display = 'inline-block';
        this.playAnimation('entry');
    },

    _hideItem: function() {
        this.playAnimation('exit', {
            animation: 'exit'
        });
    },

    _onItemChanged: function(item) {
        this.activated = item.activated ? item.activated : false;
        this.selected = item.selected ? item.selected : false;
    },

    _computeOrganizationUnits: function(item, type) {
        var result = '';

        if (item && type) {

            if ('account' === type) {
                item = item.account;
            }

            if (item.org_units && 0 < item.org_units.length) {
                var orgUnits = item.org_units,
                    length = orgUnits.length;

                for (var i = 0; i < length; i++) {
                    result += orgUnits[i].name;
                    result += (i === length - 1) ? '' : ', ';
                }
            }
            else {
                result = '';
            }
        }

        return result;
    },

    _computeGroups: function(item, type) {
        var result = '';

        if (item && type) {

            if ('account' === type) {
                item.groups = item.group;
            }

            if (item.groups && item.groups.length > 0) {
                var groups = item.groups,
                    length = groups.length;

                for (var i = 0; i < length; i++) {
                    result += groups[i].name;
                    result += (i === length - 1) ? '' : ', ';
                }
            }
            else {
                result = '';
            }
        }

        return result;
    },

    _enableSelectActionHover: function() {

        setTimeout(function() {
            this.hoverDisabled = false;
        }.bind(this), 1000);
    },

    _onSelectedChanged: function() {
        this.updateStyles();
    },

    _onNeonAnimationFinished: function(event) {

        if ('exit' === event.detail.animation) {
            this.animationConfig.exit.node.style.display = 'none';
        }
    },

    _onItemAction: function() {
        this.activated = !this.activated;
        this.item.activated = this.activated;

        this.dispatchEvent(new CustomEvent('item', {
            bubbles: true,
            composed: true,
            detail: {
                item: this.item
            }
        }));
    },

    _onSelectItemAction: function(event) {
        event.stopPropagation();

        this.selected = !this.selected;
        this.item.selected = this.selected;

        if (!this.selected) {
            this.hoverDisabled = true;
            this._enableSelectActionHover();
        }

        this.dispatchEvent(new CustomEvent('select-item', {
            bubbles: true,
            composed: true,
            detail: {
                item: this.item
            }
        }));
    },

    _onEditItemAction: function(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('edit-item', {
            bubbles: true,
            composed: true,
            detail: {
                item: this.item
            }
        }));
    }
};
