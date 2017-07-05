/* String utility functions
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 00:27:44
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-04 01:40:14
 */

const joi = require('joi');
const cimico = require('cimico');

const validate = require('../lib/validate');

const log = cimico('cimico:strings', {
  pretty: false
});

/**
 * @module {object} strings
 */
module.exports = {
  /**
   * Change a key that is in camel case into ENV variable format
   * Eg,
   *  myAwesomeVar => MY_AWESOME_VAR
   *  MyAwesomeVar => MY_AWESOME_VAR
   *
   * @param {string} string
   * @param {string} [envDelimiter='_'] - Delimiter used in the ENV variables
   *
   * @returns {string}
   */
  transformCamelCase(string, envDelimiter = '_') {
    log.f.debug(
      'Transforming with string %bu and delimiter %bu',
      string,
      envDelimiter
    );
    const transformed = (string.charAt(0).toLowerCase() + string.slice(1))
      .replace(/([A-Z])/g, '_$1')
      .split('_')
      .map(f => f.toUpperCase())
      .join(envDelimiter);
    log.f.debug('Transformed %bu to %bu', string, transformed);
    return transformed;
  },

  /**
   * Change a key that in in snake case into ENV variable format
   * Eg,
   *  my_awesome_var => MY_AWESOME_VAR
   *  _my_awesome_var => MY_AWESOME_VAR (just because you can, you don't have to)
   *
   * @param {any} string
   * @param {string} [keyDelimiter='_'] - Delimiter used in the key
   * @param {string} [envDelimiter='_'] - Delimiter used inthe ENV variables
   *
   * @returns {string}
   */
  transformSnakeCase(string, keyDelimiter = '_', envDelimiter = '_') {
    return (string[0] === keyDelimiter ? string.slice(1) : string)
      .split(keyDelimiter)
      .map(f => f.toUpperCase())
      .join(envDelimiter);
  },

  /**
   * Transfrom key into ENV variable format
   *
   * @param {string} string
   * @param {Object} [opts={}]
   * @param {Object} opts.key
   * @param {string} [opts.key.case='snake']
   * @param {string} [opts.key.delimiter='_']
   * @param {Object} opts.env
   * @param {string} [opts.env.delimiter='_']
   *
   * @returns string
   */
  transformKey(string, opts = {}) {
    if (typeof string !== 'string') {
      return string;
    }
    const { key, env } = validate(
      opts,
      joi.object().keys({
        key: joi
          .object()
          .keys({
            case: joi.string().valid(['snake', 'camel']).default('snake'),
            delimiter: joi.string().default('_')
          })
          .default({
            case: 'snake',
            delimiter: '_'
          }),
        env: joi
          .object()
          .keys({
            delimiter: joi.string().default('_')
          })
          .default({
            delimiter: '_'
          })
      })
    );

    if (key.case === 'camel') {
      return this.transformCamelCase(string, env.delimiter);
    }
    return this.transformSnakeCase(string, key.delimiter, env.delimiter);
  }
};