/**
 * @fileoverview Rule to disallow use of v-html in vue templates without applying a filter
 * @author Ben Clarke
 */

'use strict';

const utils = require('eslint-plugin-vue/lib/utils');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow v-html without a filter',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        'filter': {
          'type': 'string'
        }
      }
    ]
  },
  create(context) {

    const template =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore();

    const filter = context.options[0] || 'xss';

    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute'(item) {

        const key = item.key;
        const val = item.value;

        if ('html' !== key.name) {
          return;
        }

        if (!val.expression) {
          return;
        }

        if ('CallExpression' !== val.expression.type
          || val.expression.callee.name !== filter) {

          const start = template.getFirstToken(val);
          const close = template.getLastToken(item);

          context.report({
            node: item,
            message: '\'v-html\' directive does not filter its contents',
            fix: (fixer) => [ fixer.insertTextAfter(start, `${filter}(`), fixer.insertTextBefore(close, ')') ]
          });
        }

      }
    });
  }
};
