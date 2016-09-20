import postcss from 'postcss';
import _ from 'lodash';
import chalk from 'chalk';
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
      matter = resolve(matter, matters);
      if (matter.isIsolate()) {
        try {
          css.insertBefore(matter.initialTargetSelector, matter.rule);
        } catch (err) {
          const prefix = chalk.white.bold.bgYellow(' postcss-matter ');
          const message = chalk.yellow(`${matter.name} was unused matter`);
          console.log(`${prefix} ${message}`);
          return;
        }
      } else {
        matter.replaceDecl();
      }
      matter.removeOrigin();
    });

    function collectMatter() {
      const matters = {};
      css.walkAtRules('matter', rule => {
        const decls = _.filter(rule.nodes, node => node.type === 'rule');

        if (!decls.length) {
          rule.remove();
          return;
        }

        _.forEach(decls, node => {
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

    function resolve(matter, matters) {
      matter.node.walkDecls('matter', decl => {
        if (matters[decl.value]) {
          const innerMatter = matters[decl.value];
          decl.parent.insertBefore(decl, innerMatter.decls);
          decl.remove();
        }
      });
      return matter;
    }
  };
});
