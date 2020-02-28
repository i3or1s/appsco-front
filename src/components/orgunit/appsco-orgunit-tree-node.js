/**
`appsco-orgunit-tree-node`
Representation of organization unit item

    <appsco-orgunit-tree-node>
    </appsco-orgunit-tree-node>

### Styling

`<appsco-orgunit-tree-node>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-orgunit-tree-node` | Mixin for the root element | `{}`

@demo demo/appsco-orgunit-tree-node.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/scale-down-animation.js';
import './appsco-orgunit-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOrgUnitTreeNode extends mixinBehaviors([ NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            @apply --appsco-orgunit-tree-node;
            }
            :host .flex {
            @apply --layout-flex;
            }
            :host .layout-horizontal {
            @apply --layout-horizontal;
            }
            :host .node {
                margin: 5px 0;
            }
            :host .node-icon {
                width: 24px;
            }
            :host .children {
                display: none;
            }
            :host appsco-orgunit-item {
                margin-left: -4px;
            }
            :host .toggle-icon {
                transition: transform 0.2s linear;
                cursor: pointer;
            }
            :host .toggle-icon-expanded {
                transform: rotate(180deg);
                transition: transform 0.3s linear;
            }
        </style>

        <div class="layout-horizontal node">
            <div class="node-icon">
                <template is="dom-if" if="[[ _hasChildren(node) ]]">
                    <iron-icon icon="icons:expand-more" id="expandIcon" class="toggle-icon" on-tap="_onToggleNode"></iron-icon>
                </template>
            </div>
            <div class="flex">
                <appsco-orgunit-item org-unit="[[ node ]]" add="" modify="" remove\$="[[ _removeAction ]]"></appsco-orgunit-item>

                <div id="nodeChildren" class="children">
                    <template is="dom-if" if="[[ _hasChildren(node) ]]">
                        <template is="dom-repeat" items="[[ node.children ]]" as="child">
                            <appsco-orgunit-tree-node id="treeNode" node="[[ child ]]"></appsco-orgunit-tree-node>
                        </template>
                    </template>
                </div>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-orgunit-tree-node'; }

  static get properties() {
      return {
          node: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          expanded: {
              type: Boolean,
              value: false
          },

          /**
           * Indicates if Remove Org Unit action should be available or not.
           */
          _removeAction: {
              type: Boolean,
              computed: '_computeRemoveAction(node)'
          },

          animationConfig: {
              value: function () {
                  return {

                  }
              }
          }
      };
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': {
              name: 'scale-up-animation',
              node: this.$.nodeChildren,
              axis: 'y',
              transformOrigin: '0 0',
              timing: {
                  duration: 300
              }
          },
          'exit': {
              name: 'scale-down-animation',
              node: this.$.nodeChildren,
              axis: 'y',
              transformOrigin: '0 0',
              timing: {
                  duration: 200
              }
          }
      };

      afterNextRender(this, function() {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('neon-animation-finish', this._onAnimationFinish);
  }

  collapseNode() {
      const childNode = this.shadowRoot.getElementById('treeNode');

      this.expanded = false;
      this._collapse();

      if (childNode) {
          childNode.collapseNode();
      }
  }

  _computeRemoveAction(node) {
      return !this._hasChildren(node) && (node && !!node.parent);
  }

  _hasChildren(node) {
      return node && node.children && node.children.length > 0;
  }

  _onToggleNode() {
      this.expanded = !this.expanded;
      this.expanded ? this._expand() : this._collapse();
  }

  _expand() {
      const expandIcon = this.shadowRoot.getElementById('expandIcon');

      expandIcon.className = expandIcon.className + ' toggle-icon-expanded';

      this.animationConfig.exit.node.style.display = 'block';
      this.playAnimation('entry');
  }

  _collapse() {
      const expandIcon = this.shadowRoot.getElementById('expandIcon');

      if (expandIcon) {
          expandIcon.className = expandIcon.className.replace(' toggle-icon-expanded', '');

          this.playAnimation('exit', {
              node: this.animationConfig.exit.node
          });
      }
  }

  _onAnimationFinish(event) {
      const node = event.detail.node;

      if (node && !this.expanded) {
          node.style.display = 'none';
      }
  }
}
window.customElements.define(AppscoOrgUnitTreeNode.is, AppscoOrgUnitTreeNode);
