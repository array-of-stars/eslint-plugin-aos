/**
 * @fileoverview A Collection of ESLint rules developed at AOS
 * @author Ben Clarke
 */

'use strict';

module.exports = {
  rules: {
    'no-v-html-without-filter': require('./rules/no-v-html-without-filter.js')
  }
};
