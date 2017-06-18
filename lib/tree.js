/* A tree data structure
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 02:31:44
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 03:21:38
 */

const joi = require('joi');
const validate = require('./validate');

class Tree {
  /**
   * Constructor
   *
   * @param {Object} data
   * @param {Class} data.type - JS type class
   * @param {string} data.key - the key in config object / parent object or array
   * @param {string} data.env - the env prefix or the actual variable
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

  /**
   * Add a children which is also tree
   *
   * @param {Object} data
   * @param {Class} data.type - JS type class
   * @param {string} data.key - the key in config object / parent object or array
   * @param {string} data.env - the env prefix or the actual variable
   * @param {Object|Array} data.value - most possibaly an object or array
   *
   * @memberof Tree
   */
  addChildren(data) {
    const values = Object.assign({}, data, {
      parent: this,
    });
    const tree = new Tree(values, this);
    this.children.push(tree);
    return tree;
  }

  print(indent = 0) {
    const spaces = new Array(indent + 1).join(' ');
    let string = `${spaces}${this.key}:`;
    this.children.forEach((child) => {
      string += `\n${child.print(indent + 1)}`;
    });
    return string;
  }
}

module.exports = Tree;