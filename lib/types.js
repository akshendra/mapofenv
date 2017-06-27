/* Declare all types
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-28 02:48:32
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-28 04:42:18
 */

const is = require('is_js');

class Type {
  constructor() {
    this.value = {};
    this.name = 'Generic type';
  }

  // eslint-disable-next-line
  add(key, value) {
    throw new Error('Can only add to object or array');
  }

  // eslint-disable-next-line
  validation() {
    return true;
  }
}

class ObjectType extends Type {
  constructor() {
    super();
    this.value = {};
    this.name = 'Object';
  }

  add(key, value) {
    Object.assign(this.value, {
      [key]: value
    });
  }

  addValue(v) {
    this.value = {};
  }
}

class StringType extends Type {
  constructor() {
    super();
    this.value = '';
    this.name = 'String';
  }

  // eslint-disable-next-line
  validation(value) {
    return is.string(value);
  }

  addValue(v) {
    if (this.validation(v) === false) {
      throw new Error(`Should be a string, but found ${v}`);
    }
    this.value = String(v);
  }
}

class IntegerType extends Type {
  constructor() {
    super();
    this.value = 0;
    this.name = 'Integer';
  }

  // eslint-disable-next-line
  validation(value) {
    const regex = /[0-9]*/;
    const match = value.match(regex);
    if (match) {
      return true;
    }
    return false;
  }

  addValue(v) {
    if (this.validation(v) === false) {
      throw new Error(`Should be a integer, but found ${v}`);
    }
    this.value = parseInt(v, 10);
  }
}

class ArrayType extends Type {
  constructor(itemType, length) {
    super();
    this.value = [];
    this.name = 'Integer';
    this.itemType = itemType;
    this.itemLength = length;
    this.values = 
  }

  addValue(v, env) {
    this.value = [];
  }

  add(key, value) {

  }
}

module.exports = {
  Object: ObjectType,
  String: StringType,
  Integer: IntegerType,
  Array: ArrayType
};
