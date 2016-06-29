import postcss from 'postcss';
import _ from 'lodash';

export default class Matter {
  constructor(node, param, opts) {
    this.node = node;
    this.name = param ?
                `${param}-${node.selector}` :
                node.selector;
    this.decls = node.nodes;
    this.length = node.nodes.length;
    this.targetDecls = [];
    this._opts = opts;
  }

  get initialTargetSelector() {
    return this.targetDecls[0].parent;
  }

  get selector() {
    const selectors = _.map(this.targetDecls, decl => decl.parent.selector);
    return _.uniq(selectors).join(',\n');
  }

  get rule() {
    return postcss.rule({
      selector: this.selector,
      nodes: this.decls
    });
  }

  replaceDecl() {
    _.forEach(this.targetDecls, decl => {
      decl.parent.insertBefore(decl, this.decls);
    });
  }

  removeOrigin() {
    _.forEach(this.targetDecls, decl => {
      const parent = decl.parent;
      decl.remove();
      if (!parent.nodes.length) {
        parent.remove();
      }
    });
  }

  hasTarget() {
    return Boolean(this.targetSelectors.length);
  }

  isIsolate() {
    return Boolean(this.decls.length >= this._opts.isolateLength);
  }
}
