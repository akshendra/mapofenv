/**
 * Object type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 14:33:57
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:34:10
 */

const _ = require('lodash');
const cimico = require('cimico');

const BaseType = require('./base');
const strings = require('../strings');

const log = cimico('cimico:types', {
  pretty: false
});

class ObjectType extends BaseType {
  constructor() {
    super('Object', {});
  }

  addChild(key, type) {
    log.f.debug(
      'Adding child to object of type %bu at key %bu',
      type.name,
      key
    );
    Object.assign(this.value, {
      [key]: type
    });
  }

  getChildEnv(key) {
    let childEnv = strings.transformKey(key);
    if (this.env) {
      childEnv = `${this.env}_${childEnv}`;
    }
    log.f.debug("Got object's child env %bu", childEnv);
    return childEnv;
  }

  read(options) {
    log.f.log('Object reading env %bu', this.env);
    Object.keys(this.value).forEach((key) => {
      const type = this.value[key];
      const childEnv = this.getChildEnv(key);
      type.addEnv(childEnv);
      type.read(options);
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