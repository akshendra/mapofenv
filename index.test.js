/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-08-13 00:53:55
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-08-13 04:09:58
 */

const expect = require('chai').expect;
const { string, number, isNumber, object, array, mapofenv } = require('./index');

describe('MapOfEnv', function () {
  it('should work for strings', function () {
    const schema = {
      username: [string],
      password: [string],
    };
    process.env.MOE_USERNAME = 'mapofenv';
    process.env.MOE_PASSWORD = 'wasted';
    const obj = mapofenv(object(schema), { prefix: 'MOE' });
    expect(obj).to.deep.equal({
      username: 'mapofenv',
      password: 'wasted',
    });
  });

  it('should work for nested objects', function () {
    const schema = {
      redis: object({
        host: [string],
        port: [string],
      }),
      username: [string],
      password: [string],
    };
    process.env.MOE_REDIS_HOST = '127.0.0.1';
    process.env.MOE_REDIS_PORT = '1234';
    const obj = mapofenv(object(schema), { prefix: 'MOE' });
    expect(obj).to.deep.equal({
      redis: {
        host: '127.0.0.1',
        port: '1234',
      },
      username: 'mapofenv',
      password: 'wasted',
    });
  });

  it('should be able to handle arrays', function () {
    const schema = {
      users: array({ items: [string], length: 2 }),
      redis: object({
        host: [string],
        port: [string],
      }),
      username: [string],
      password: [string],
    };
    process.env['MOE_USERS[0]'] = 'akshendra';
    process.env['MOE_USERS[1]'] = 'pratap';

    const obj = mapofenv(object(schema), { prefix: 'MOE' });
    expect(obj).to.deep.equal({
      users: ['akshendra', 'pratap'],
      redis: {
        host: '127.0.0.1',
        port: '1234',
      },
      username: 'mapofenv',
      password: 'wasted',
    });
  });

  it('should handle object inside arrays', function () {
    const schema = {
      users: array({ items: [string], length: 2 }),
      redis: object({
        host: [string],
        port: [string],
      }),
      username: [string],
      password: [string],
      servers: array({
        length: 2,
        items: object({
          host: string,
          port: string,
        }),
      }),
    };
    process.env['MOE_SERVERS[0]_HOST'] = '127.0.0.1';
    process.env['MOE_SERVERS[0]_PORT'] = '1234';
    process.env['MOE_SERVERS[1]_HOST'] = '127.0.0.2';
    process.env['MOE_SERVERS[1]_PORT'] = '1235';

    const obj = mapofenv(object(schema), { prefix: 'MOE' });
    expect(obj).to.deep.equal({
      users: ['akshendra', 'pratap'],
      redis: {
        host: '127.0.0.1',
        port: '1234',
      },
      username: 'mapofenv',
      password: 'wasted',
      servers: [{
        host: '127.0.0.1',
        port: '1234',
      }, {
        host: '127.0.0.2',
        port: '1235',
      }],
    });
  });
});

describe('Errors', function () {
  it('should give errros on first level', function () {
    const schema = {
      port: [number, isNumber],
    };
    process.env.ERRORS_PORT = 'abc';

    expect(() => mapofenv(object(schema), { prefix: 'ERRORS' }))
      .to.throw('ERRORS_PORT should be a number');
  });

  it('should be able to handle errors in nested object', function () {
    const schema = {
      redis: object({
        port: [number, isNumber],
      }),
    };
    process.env.ERRORS_REDIS_PORT = 'abc';

    expect(() => mapofenv(object(schema), { prefix: 'ERRORS' }))
    .to.throw('ERRORS_REDIS_PORT should be a number');
  });

  it('should be able to handle multiple errors', function () {
    const schema = {
      port: [number, isNumber],
      redis: object({
        port: [number, isNumber],
      }),
    };

    expect(() => mapofenv(object(schema), { prefix: 'ERRORS' }))
    .to.throw('ERRORS_REDIS_PORT should be a number, ERRORS_PORT should be a number');
  });

  it('should be able to handle errors in arrays', function () {
    const schema = {
      ports: array({
        items: [number, isNumber],
        length: 2,
      }),
    };
    process.env['ERRROS_PORTS[0]'] = 'abc';
    process.env['ERRROS_PORTS[1]'] = 'def';

    expect(() => mapofenv(object(schema), { prefix: 'ERRORS' }))
    .to.throw('ERRORS_PORTS[0] should be a number, ERRORS_PORTS[1] should be a number');
  });

  it('should be able to handle a lot of erros, nested everywhere', function () {
    const schema = {
      port: [number, isNumber],
      redis: object({
        port: [number, isNumber],
      }),
      servers: array({
        length: 1,
        items: object({
          port: [number, isNumber],
        }),
      }),
    };

    process.env['ERRORS_SERVERS[0].PORT'] = 'qwe';

    expect(() => mapofenv(object(schema), { prefix: 'ERRORS' }))
    .to.throw('ERRORS_SERVERS[0]_PORT should be a number, ERRORS_REDIS_PORT should be a number, ERRORS_PORT should be a number');
  });
});
