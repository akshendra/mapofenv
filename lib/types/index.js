/**
 * Export all types
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 12:27:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-29 16:25:44
 */

const BaseType = require('./base');
const IntegerType = require('./integer');
const StringType = require('./string');
const ObjectType = require('./object');
const ArrayType = require('./array');

module.exports = {
  BaseType,
  IntegerType,
  StringType,
  ObjectType,
  ArrayType
};
