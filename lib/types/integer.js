/**
 * Integer type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 14:33:57
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-29 15:06:55
 */

const is = require('is_js');
const BaseType = require('./base');

class IntegerType extends BaseType {
  constructor() {
    super('Integer', 0);
  }

  coerce() {
    this.value = parseInt(this.value, 10);
  }

  validate() {
    if (is.integer(this.value) === false) {
      throw new Error(
        `Value at ${this.env} should be Integer but found ${this.value}`
      );
    }
  }
}

module.exports = IntegerType;
