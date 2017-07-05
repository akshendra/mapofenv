/**
 * Number type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 14:33:57
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:37:17
 */

const BaseType = require('./base');

class NumberType extends BaseType {
  constructor() {
    super('Number', 0);
    this.before = 'number';
    this.transformer = 'float';
    this.after = 'number';
  }
}

module.exports = NumberType;
