import postcss from 'postcss';
import _ from 'lodash';
import Matter from './matter';

const defaultOpts = {
  isolateLength: 3
};

export default postcss.plugin('postcss-matter', (opts = {}) => {
  opts = Object.assign({}, defaultOpts, opts);

  return css => {
    const matters = collectMatter();
    walkDecls();
    _.forEach(matters, matter => {
      if (matter.isIsolate()) {
        css.insertBefore(matter.initialTargetSelector, matter.rule);
      } else {
        matter.replaceDecl();
      }
      matter.removeOrigin();
    });

    function collectMatter() {
      const matters = {};
      css.walkAtRules('matter', rule => {
        _.forEach(rule.nodes, node => {
          const matter = new Matter(node, rule.params, opts);
          matters[matter.name] = matter;
        });
        rule.remove();
      });
      return matters;
    }

    function walkDecls() {
      css.walkDecls('matter', decl => {
        if (matters[decl.value]) {
          const matter = matters[decl.value];
          matter.targetDecls.push(decl);
        }
      });
    }
  };
});
