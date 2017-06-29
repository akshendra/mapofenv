/**
 * Object type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 14:33:57
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-29 16:49:23
 */

const _ = require('lodash');
const cimico = require('cimico');

const BaseType = require('./base');
const strings = require('../strings');

const log = cimico({
  pretty: false
});

class ObjectType extends BaseType {
  constructor() {
    super('Object', {});
  }

  addChild(key, type) {
    Object.assign(this.value, {
      [key]: type
    });
  }

  getChildEnv(key) {
    const childEnv = strings.transformKey(key);
    if (this.env) {
      return `${this.env}_${childEnv}`;
    }
    return childEnv;
  }

  read() {
    log.f.log('Object reading env=%d', this.env);
    Object.keys(this.value).forEach((key) => {
      const type = this.value[key];
      const childEnv = this.getChildEnv(key);
      type.addEnv(childEnv);
      type.read();
    });
  }

  getValue() {
    const object = {};
    _.forOwn(this.value, (type, key) => {
      object[key] = type.getValue();
    });
    return object;
  }
}

module.exports = ObjectType;
