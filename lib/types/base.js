/**
 * Extends all types from here
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 12:26:28
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-29 16:49:42
 */

const cimico = require('cimico');

const log = cimico({
  pretty: false
});

class BaseType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.env = null;
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
    log.f.log('%b reading %b(env)', this.name, this.env);
    this.value = process.env[this.env];
    this.coerce();
    this.validate();
  }
}

module.exports = BaseType;
