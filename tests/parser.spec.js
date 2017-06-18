/* Tests for parser
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 02:11:30
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 04:21:34
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const expect = require('chai').expect;
const parser = require('../src/parser');

describe('lines', () => {
  it('should split a string into lines', () => {
    const string = `
1. Line one
2. Line two
3. Line tree
    `;
    const lines = parser.lines(string);
    expect(lines).to.have.length(3);
  });

  it('should split a string from file into lines', async () => {
    const data = await util.promisify(fs.readFile)(
      path.join(__dirname, 'data/lines'),
    );
    const lines = parser.lines(data.toString());
    expect(lines).to.have.length(3);
  });
});

describe('lineData', () => {
  it('should be able to parse objects', () => {
    const string = '  _key-it:{}';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: '_key-it',
      type: Object,
      items: null,
      length: null,
    });
  });

  it('should be able to parse numbers', () => {
    const string = '  _key-it:+(10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: '_key-it',
      type: Number,
      items: null,
      length: 10,
    });
  });

  it('should be able to parse strings', () => {
    const string = '  _key-it:"(10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: '_key-it',
      type: String,
      items: null,
      length: 10,
    });
  });

  it('should be able to parse array of objects', () => {
    const string = '  key:[{}](10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: 'key',
      type: Array,
      items: Object,
      length: 10,
    });
  });

  it('should be able to parse array of numbers', () => {
    const string = 'key:[+](10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 0,
      key: 'key',
      type: Array,
      items: Number,
      length: 10,
    });
  });

  it('should be able to parse array of strings', () => {
    const string = '    key:["](10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 4,
      key: 'key',
      type: Array,
      items: String,
      length: 10,
    });
  });
});
