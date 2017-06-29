/**
 * String type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 14:33:57
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-29 15:09:01
 */

const is = require('is_js');

const BaseType = require('./base');

class StringType extends BaseType {
  constructor() {
    super('String', '');
  }

  validate() {
    if (is.not.existy(this.value) || is.empty(this.value)) {
      throw new Error(
        `Value at ${this.env} should be String but found ${this.value}`
      );
    }
  }
}

module.exports = StringType;
