/* A general pupose validation function, using joi
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 01:13:23
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 01:26:56
 */

const joi = require('joi');

/**
 * Validate a value using joi
 *
 * @param {any} value
 * @param {any} schema
 * @param {Object} [options={}] - joi options
 *
 * @returns {any}
 * @throws {TypeError} for any validation error
 */
function validate(value, schema, options = {}) {
  const result = joi.validate(value, schema, options);

  if (result.error) {
    throw new TypeError(
      result.error.details.map(d => `In ${d.path}, ${d.message}`).join(';'),
    );
  }

  return result.value;
}

/**
 * @module {Function} validate
 */
module.exports = validate;
