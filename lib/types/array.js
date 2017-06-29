/**
 * Array type
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-29 16:20:14
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-29 16:47:39
 */

const BaseType = require('./base');
const cimico = require('cimico');

const log = cimico({
  pretty: false
});

class ArrayType extends BaseType {
  constructor() {
    super('Array', []);
  }

  addChild(type) {
    this.value.push(type);
  }

  getChildEnv(i) {
    const childEnv = `${this.env}[${i}]`;
    return childEnv;
  }

  read() {
    log.f.log('Array reading env=%d', this.env);
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
