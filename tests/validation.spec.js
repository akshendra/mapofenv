/**
 * Test regular expression support
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-04 01:58:28
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-05 22:57:46
 */

const expect = require('chai').expect;

const parser = require('../lib/peg');

describe('Regex Support', () => {
  it('Parse simple value', () => {
    const string = `
db: Object
  host: String
  port: Number [integer => integer => integer]
auth: Object
  username: String
  password: String
`;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '1234';
    process.env.AUTH_USERNAME = 'akshendra';
    process.env.AUTH_PASSWORD = 'wonderful';

    const result = parser(string);
    expect(result).to.deep.equal({
      db: {
        port: 1234,
        host: '127.0.0.1',
      },
      auth: {
        username: 'akshendra',
        password: 'wonderful',
      },
    });
  });
});