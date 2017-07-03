/**
 * Array type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 16:20:14
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-04 00:38:29
 */

const BaseType = require('./base');
const cimico = require('cimico');

const log = cimico('cimico:types', {
  pretty: false
});

class ArrayType extends BaseType {
  constructor() {
    super('Array', []);
  }

  addChild(type) {
    log.f.debug('Adding child to array of type %bu', type.name);
    this.value.push(type);
  }

  getChildEnv(i) {
    const childEnv = `${this.env}[${i}]`;
    log.f.debug("Got array's child env %bu", childEnv);
    return childEnv;
  }

  read() {
    log.f.log('Array reading env %bu', this.env);
    this.value.forEach((type, index) => {
      const childEnv = this.getChildEnv(index);
      type.addEnv(childEnv);
      type.read();
    });
  }

  getValue() {
    return this.value.map(t => t.getValue());
  }
}

module.exports = ArrayType;
