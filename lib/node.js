/* Node for the tree our tree
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 02:33:01
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 02:50:09
 */

const joi = require('joi');
const validate = require('./validate');

class Node {
  /**
   * Constructor
   *
   * @param {Object} data
   * @param {Class} data.type - JS type class
   * @param {string} data.key - the key in config object / parent object or array
   * @param {string} data.env - the env prefix or the actual variable
   * @param {Object|null} data.parent - null for root otherwise a tree
   * @param {Object|Array} data.value - most possibaly an object or array
   *
   */
  constructor(data) {
    const values = validate(
      data,
      joi.object().keys({
        type: joi.object().valid([Array, Object, String, Number]),
        key: joi.string().required(),
        env: joi.string().required(),
        value: joi.alternatives([joi.object(), joi.array()]).required(),
        parent: joi.object().default(null),
      }),
    );

    Object.assign(this, values, {
      children: [],
    });
  }
}

module.exports = Node;
