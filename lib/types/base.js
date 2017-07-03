/**
 * Extends all types from here
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 12:26:28
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-04 02:32:08
 */

const cimico = require('cimico');

const log = cimico('cimico:types', {
  pretty: false
});

class BaseType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.env = null;
    this.regexp = null;
  }

  addRegExp(exp) {
    this.regexp = exp;
  }

  applyRegExp() {
    let check = true;
    if (this.regexp) {
      check = this.regexp.test(this.value);
    }

    if (check === false) {
      throw new Error(`${this.value} must match the regex ${this.regexp}`);
    }
  }

  addEnv(env) {
    this.env = env;
  }

  getValue() {
    return this.value;
  }

  validate() {
    if (this.value) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line
  coerce() {
    // do nothing
  }

  read() {
    log.f.log('%bu reading %bu', this.name, this.env);
    this.value = process.env[this.env];
    this.applyRegExp();
    this.coerce();
    this.validate();
  }
}

module.exports = BaseType;
