/* Test the peg
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-27 23:29:25
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-28 00:49:41
 */

const expect = require('chai').expect;

const parser = require('../lib/peg');

describe('Peg', () => {
  it('Parse simple value', () => {
    const string = `
name: String
username: String
`;

    process.env.USERNAME = 'pratap';
    process.env.NAME = 'akshendra';

    const result = parser.parse(string);
    // console.log(result);
    expect(result).to.deep.equal({
      name: 'akshendra',
      username: 'pratap',
    });
  });
});
