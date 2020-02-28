/**
`appsco-orgunit-tree`
Representation of organization unit item

    <appsco-orgunit-tree>
    </appsco-orgunit-tree>

### Styling

`<appsco-orgunit-tree>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-orgunit-tree` | Mixin for the root element | `{}`

@demo demo/appsco-orgunit-tree.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './appsco-orgunit-tree-node.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOrgUnitTree extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            @apply --appsco-orgunit-tree;
            }
        </style>

        <appsco-orgunit-tree-node id="treeNode" node="[[ _rootNode ]]"></appsco-orgunit-tree-node>
`;
  }

  static get is() { return 'appsco-orgunit-tree'; }

  static get properties() {
      return {
          _rootNode: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _treeNodes: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          /**
           * [OrgUnit]() that is to be rendered
           */
          orgUnits: {
              type: Array,
              value: function () {
                  return [];
              }
          }
      };
  }

  static get observers() {
      return [
          'orgUnitsChanged(orgUnits.*)'
      ];
  }

  ready() {
      super.ready();

      afterNextRender(this, function() {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('selected', this._onNodeSelected);
  }

  orgUnitsChanged() {
      var treeNodes = this.unflatten(this.orgUnits);

      this.set('_rootNode', {});
      this.set('_rootNode', treeNodes[0]);
  }

  unflatten(arr) {
      let tree = [],
          mappedArr = {},
          length = arr.length,
          arrElem,
          mappedElem;

      // First map the nodes of the array to an object -> create a hash table.
      for (let i = 0; i < length; i++) {
          arrElem = arr[i];

          mappedArr[arrElem.self] = arrElem;
          mappedArr[arrElem.self]['children'] = [];
      }

      for (const id in mappedArr) {
          if (mappedArr.hasOwnProperty(id)) {
              mappedElem = mappedArr[id];

              if (!mappedElem.selected) {
                  mappedElem.selected = false;
              }

              // If the element is not at the root level, add it to its parent array of children.
              if (mappedElem.parent) {
                  mappedArr[mappedElem['parent']]['children'].push(mappedElem);
              }
              // If the element is at the root level, add it to first level elements array.
              else {
                  tree.push(mappedElem);
              }
          }
      }

      return tree;
  }

  addOrgunit(orgunit) {
      const orgunits = JSON.parse(JSON.stringify(this.orgUnits));

      orgunit.selected = false;
      orgunits.push(orgunit);

      this.set('orgUnits', []);
      this.set('orgUnits', orgunits);
  }

  /**
   * Finds orgunit in list and modifies it.
   * If item doesn't exist it adds item to the list.
   *
   * @param orgunit
   */
  setOrgunit(orgunit) {
      const orgunits = JSON.parse(JSON.stringify(this.orgUnits)),
          length = orgunits.length;

      for (let i = 0; i < length; i++) {
          const currentOrgunit = orgunits[i];

          if (currentOrgunit.self === orgunit.self) {
              orgunits[i] = orgunit;
              this.set('orgUnits', []);
              this.set('orgUnits', orgunits);
              break;
          }
      }
  }

  removeOrgunit(orgunit) {
      const orgunits = JSON.parse(JSON.stringify(this.orgUnits)),
          index = this.orgUnits.indexOf(orgunit);

      orgunits.splice(index, 1);

      this.set('orgUnits', []);
      this.set('orgUnits', orgunits);
  }

  reset() {
      this._deselectAll();
      this._collapseAll();
  }

  _deselectAll() {
      const orgunits = JSON.parse(JSON.stringify(this.orgUnits)),
          length = orgunits.length;

      for (let i = 0; i < length; i++) {
          orgunits[i].selected = false;
      }

      this.set('orgUnits', []);
      this.set('orgUnits', orgunits);
  }

  _collapseAll() {
      this.$.treeNode.collapseNode();
  }

  _onNodeSelected(event) {
      const orgunit = event.detail.orgUnit,
          selected = event.detail.selected,
          orgunits = JSON.parse(JSON.stringify(this.orgUnits)),
          length = orgunits.length;

      for (let i = 0; i < length; i++) {
          const currentOrgunit = orgunits[i];

          if (currentOrgunit.self === orgunit.self) {
              orgunits[i].selected = selected;
          }
          else {
              orgunits[i].selected = false;
          }
      }

      this.set('orgUnits', []);
      this.set('orgUnits', orgunits);
  }
}
window.customElements.define(AppscoOrgUnitTree.is, AppscoOrgUnitTree);
