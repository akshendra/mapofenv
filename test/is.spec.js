
const { expect } = require('chai');
const { isFunction, isObject, isArray } = require('../src/is');

describe('Object', () => {
  it('should give true for as objects', () => {
    expect(isObject({})).to.be.true;
    expect(isObject({
      a: 100
    })).to.be.true;
  });

  it('should give false for array', () => {
    expect(isObject([])).to.be.false;
  });

  it('should give false for null', () => {
    expect(isObject(null)).to.be.false;
  });
});

describe('Function', () => {
  it('should give true for function', () => {
    expect(isFunction(String)).to.be.true;
    expect(isFunction(() => {})).to.be.true;
  });

  it('should give false for anything else', () => {
    expect(isFunction({})).to.be.false;
    expect(isFunction(1)).to.be.false;
    expect(isFunction([])).to.be.false;
  });
});

describe('Array', () => {
  it('should give true for arrays', () => {
    expect(isArray([])).to.be.true;
    expect(isArray(new Array())).to.be.true; // eslint-disable-line
  });

  it('should give false for anything else', () => {
    expect(isArray(1)).to.be.false;
    expect(isArray({})).to.be.false;
  });
});
