/**
 * Boolean type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 14:33:57
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:28:31
 */

const BaseType = require('./base');

class BooleanType extends BaseType {
  constructor() {
    super('Boolean', 0);
    this.before = 'boolean';
    this.transformer = 'boolean';
    this.after = 'boolean';
  }
}

module.exports = BooleanType;
