/**
 * Extends all types from here
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 12:26:28
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:41:32
 */

const is = require('is_js');
const cimico = require('cimico');

const log = cimico('cimico:types', {
  pretty: false
});

function getFunction(name, fxMap = {}) {
  const fx = fxMap[name];
  if (!fx) {
    throw new ReferenceError(`No function named ${name}`);
  }
  return fx;
}

class BaseType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.env = null;
    this.transformer = null;
    this.before = null;
    this.after = null;
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

  addValidation(validations) {
    const {
      before,
      after,
      transformer,
    } = validations;
    this.before = before || this.before;
    this.after = after || this.after;
    this.transformer = transformer || this.transformer;
  }

  addEnv(env) {
    this.env = env;
  }

  getValue() {
    return this.value;
  }

  applyBefore(fxMap) {
    if (!this.before) {
      return;
    }
    const val = getFunction(this.before, fxMap);
    let check = true;
    console.log(val, this.value);
    if (is.regexp(val)) {
      check = val.test(this.value);
    } else if (is.function(val)) {
      check = val(this.value);
    }

    if (check === false) {
      throw new Error(`${this.env} failes the before validation ${this.before}`);
    }
  }

  applyTransfrom(fxMap) {
    if (!this.transformer) {
      return;
    }
    this.value = getFunction(this.transformer, fxMap)(this.value);
  }

  applyAfter(fxMap) {
    if (!this.after) {
      return;
    }
    const check = getFunction(this.after, fxMap)(this.value);

    if (check === false) {
      throw new Error(`${this.env} failes the after validation ${this.after}`);
    }
  }

  read(options) {
    log.f.log('%bu reading %bu', this.name, this.env);
    this.value = process.env[this.env];
    this.applyBefore(options.befores);
    this.applyTransfrom(options.transformations);
    this.applyAfter(options.afters);
  }
}

module.exports = BaseType;
