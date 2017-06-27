/* Do the parsing using pegjs
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-27 23:11:54
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-28 00:13:31
 */

const fs = require('fs');
const path = require('path');
const pegjs = require('pegjs');

const grammar = fs.readFileSync(path.join(__dirname, 'grammar.peg')).toString();

const parser = pegjs.generate(grammar, {
  output: 'source',
  format: 'commonjs'
});

fs.writeFileSync(path.join(__dirname, 'generated.js'), parser);

module.exports = require(path.join(__dirname, 'generated.js'));
