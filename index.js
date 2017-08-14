/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-08-06 01:28:32
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-08-13 05:40:28
 */

const R = require('ramda');
const common = require('./libs/common');
const types = require('./libs/types');
const validations = require('./libs/validations');
const helpers = require('./libs/helpers');

const mapofenv = R.curry(function mapofenv(mappers, opts) {
  const options = Object.assign({}, {
    delimiter: '_',
    indexDelimiter: '[]',
    env: opts.prefix.toUpperCase(),
  }, opts);
  const obj = R.pipe(...common.makeMappers(mappers))(options);
  const extracted = common.extract(obj);

  if (extracted.errors && extracted.errors.length > 0) {
    throw new Error(extracted.errors.join(', '));
  }
  return extracted.value;
});

module.exports = {
  mapofenv, types, common, helpers, validations,
};
