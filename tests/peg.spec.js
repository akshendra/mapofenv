/* Test the peg
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-27 23:29:25
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-28 04:22:18
 */

const expect = require('chai').expect;

const parser = require('../lib/peg');

describe('Peg', () => {
  it('Parse simple value', () => {
    const string = `
db: Object
  host: String
  port: Integer
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

  it('parse multiple objects', () => {
    const string = `
db: Object
  host: String
  port: Integer
secret: String
redis: Object
  host: String
  port: Integer
`;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '1234';
    process.env.SECRET = 'awesomeness';
    process.env.REDIS_HOST = '127.0.0.2';
    process.env.REDIS_PORT = '1235';

    const result = parser.parse(string);

    expect(result).to.deep.equal({
      db: {
        port: 1234,
        host: '127.0.0.1',
      },
      secret: 'awesomeness',
      redis: {
        port: 1235,
        host: '127.0.0.2',
      },
    });
  });

  it('should be able to parse double object', () => {
    const string = `
one: Object
  two: Object
    three: String
    four: String
`;

    process.env.ONE_TWO_THREE = 'tree';
    process.env.ONE_TWO_FOUR = 'four';

    const result = parser.parse(string);

    expect(result).to.deep.equal(result, {
      one: {
        two: {
          three: 'three',
          four: 'four',
        },
      },
    });
  });
});
