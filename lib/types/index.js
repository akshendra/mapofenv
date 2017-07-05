/**
 * Export all types
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 12:27:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:29:01
 */

const BaseType = require('./base');
const NumberType = require('./number');
const BooleanType = require('./boolean');
const StringType = require('./string');
const ObjectType = require('./object');
const ArrayType = require('./array');

module.exports = {
  BaseType,
  NumberType,
  BooleanType,
  StringType,
  ObjectType,
  ArrayType
};
