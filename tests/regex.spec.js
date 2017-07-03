/**
 * Test regular expression support
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-04 01:58:28
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-04 02:37:22
 */

const expect = require('chai').expect;

const parser = require('../lib/peg');

describe('Regex Support', () => {
  it('Parse simple value', () => {
    const string = String.raw`
db: Object
  host: String /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
  port: Integer /[0-9]*/
`;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '1234';

    const result = parser.parse(string);
    expect(result).to.deep.equal({
      db: {
        port: 1234,
        host: '127.0.0.1',
      },
    });
  });
});
