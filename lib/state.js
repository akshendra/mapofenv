/**
 * maintain state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-28 03:06:49
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-28 04:41:46
 */

const path = require('path');

const strings = require(path.join(__dirname, '../src/strings'));

class State {
  constructor(key, parent, indent) {
    this.key = key;
    this.parent = parent;
    this.indent = indent;
    this.type = null;
    this.env = null;
  }

  addKey(value) {
    this.key = value;
    const tr = strings.transformKey(this.key);
    this.env = this.parent.env ? `${this.parent.env}_${tr}` : tr;
  }

  read() {
    const env = this.env;
    const value = process.env[env];
    if (this.type.validation(value) === false) {
      throw new ReferenceError(
        `${env} should be ${this.type.name} found - ${value}`
      );
    }
    this.type.addValue(value, env);
    if (this.parent) {
      this.parent.type.add(this.key, this.type.value);
    }
  }
}

module.exports = State;
