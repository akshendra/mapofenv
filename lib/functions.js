/**
 * Funtions provided for validations and transformation
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-05 21:15:58
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:56:16
 */
const is = require('is_js');

const transformations = {
  integer(value) {
    return parseInt(value, 10);
  },

  float(value) {
    return parseFloat(value);
  },

  boolean(value) {
    if (value === '0') {
      return true;
    }
    return false;
  }
};

const befores = {
  integer: /^[0-9]\d*$/,
  number: /^[0-9]\d*(\.\d+)?$/,
  float: /[0-9]+\.[0-9]+/,
  boolean: /0|1/,
};

const afters = {
  integer: is.integer,
  float: is.float,
  boolean: is.boolean,
  string: is.string,
  number: is.number,
};

module.exports = {
  transformations,
  befores,
  afters,
};