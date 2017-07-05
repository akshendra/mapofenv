/* Do the parsing using pegjs, used for quick testing
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-27 23:11:54
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:32:20
 */

const fs = require('fs');
const path = require('path');
const pegjs = require('pegjs');
const functions = require('./functions');

const grammar = fs.readFileSync(path.join(__dirname, '../grammar.peg')).toString();
const generated = pegjs.generate(grammar, {
  output: 'source',
  format: 'commonjs'
});
fs.writeFileSync(path.join(__dirname, 'generated.js'), generated);
const parser = require(path.join(__dirname, 'generated.js'));

module.exports = function peg(string, options = {}) {
  const result = parser.parse(string);
  result.read(Object.assign({}, functions, options));
  return result.getValue();
};
