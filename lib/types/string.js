/**
 * String type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 14:33:57
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:27:23
 */

const is = require('is_js');

const BaseType = require('./base');

class StringType extends BaseType {
  constructor() {
    super('String', '');
    this.after = 'string';
  }
}

module.exports = StringType;