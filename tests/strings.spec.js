/* Tests for string utility function
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 00:30:29
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:57:34
 */

const fs = require('fs');
const util = require('util');
const path = require('path');
const expect = require('chai').expect;
const strings = require('../lib/strings');

describe('transformCamelCase', () => {
  it('should transform "myAwesomeKey" into "MY_AWESOME_KEY"', () => {
    const str = 'myAwesomeKey';
    const result = strings.transformCamelCase(str);
    expect(result).to.equal('MY_AWESOME_KEY');
  });

  it('should transfrom "MyAwesomeKey" into "MY_AWESOME_KEY', () => {
    const str = 'MyAwesomeKey';
    const result = strings.transformCamelCase(str);
    expect(result).to.equal('MY_AWESOME_KEY');
  });
});

describe('transformSnakeCase', () => {
  it('should transfrom "my_awesome_key" into "MY_AWESOME_KEY"', () => {
    const str = 'my_awesome_key';
    const result = strings.transformSnakeCase(str);
    expect(result).to.equal('MY_AWESOME_KEY');
  });

  it('should transfrom "_My_awesome_key" into "MY_AWESOME_KEY"', () => {
    const str = '_My_awesome_key';
    const result = strings.transformSnakeCase(str);
    expect(result).to.equal('MY_AWESOME_KEY');
  });
});

describe('transformKey', () => {
  it('should transfrom "myAwesomeKey" into "MY_AWESOME_KEY"', () => {
    const str = 'myAwesomeKey';
    const result = strings.transformKey(str, {
      key: {
        case: 'camel',
        delimiter: '_',
      },
    });
    expect(result).to.equal('MY_AWESOME_KEY');
  });

  it('should transfrom "MyAwesomeKey" into "MY_AWESOME_KEY', () => {
    const str = 'MyAwesomeKey';
    const result = strings.transformKey(str, {
      key: {
        case: 'camel',
      },
    });
    expect(result).to.equal('MY_AWESOME_KEY');
  });

  it('should transfrom "my_awesome_key" into "MY_AWESOME_KEY"', () => {
    const str = 'my_awesome_key';
    const result = strings.transformKey(str);
    expect(result).to.equal('MY_AWESOME_KEY');
  });

  it('should transfrom "_My_awesome_key" into "MY_AWESOME_KEY"', () => {
    const str = '_My_awesome_key';
    const result = strings.transformKey(str);
    expect(result).to.equal('MY_AWESOME_KEY');
  });
});