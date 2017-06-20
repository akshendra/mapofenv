/* Tests for parser
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 02:11:30
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-20 04:08:09
 */

const { r, rp } = require('require-easy');

const expect = r('chai').expect;
const parser = rp(__dirname, '../src/parser.js');

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

describe('nodeStack', () => {
  it('Should create a stack of nodes from a string format', () => {
    const string = `db:{}
  host:"
  port:+
    `;
    const nodeStack = parser.nodeStack(string);
    expect(nodeStack).to.deep.equal([
      {
        indent: 2,
        key: 'port',
        type: Number,
        items: null,
        length: null,
      },
      {
        indent: 2,
        key: 'host',
        type: String,
        items: null,
        length: null,
      },
      {
        indent: 0,
        key: 'db',
        type: Object,
        items: null,
        length: null,
      },
    ]);
  });

  it('should be able to parse arrays into nodes too', () => {
    const string = `db:[{}](3)
  host:"
  port:+
    `;
    const nodeStack = parser.nodeStack(string);
    expect(nodeStack).to.deep.equal([
      {
        indent: 2,
        key: 'port',
        type: Number,
        items: null,
        length: null,
      },
      {
        indent: 2,
        key: 'host',
        type: String,
        items: null,
        length: null,
      },
      {
        indent: 0,
        key: 'db',
        type: Array,
        items: Object,
        length: 3,
      },
    ]);
  });
});

describe('createTree', () => {
  it('should create a tree', () => {
    const string = `db:{}
  host:"
  port:+
    `;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '1234';

    const tree = parser.createTree(string);
    console.log(tree.value);
  });
});
