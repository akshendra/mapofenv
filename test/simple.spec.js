
const { expect } = require('chai');
const { parse } = require('../src/index.js');

const mapping = {
  google: {
    projectId: String,
  },
  use: Boolean,
  redis: {
    cluster: {
      use: Boolean,
      hosts: [{
        host: String,
        port: Number,
      }, {
        host: String,
        port: Number,
      }],
    },
  },
  mongo: {
    host: String,
    port: Number,
    db: String,
    options: {
      readPreference: String,
    },
  },
  un: {
    host: String,
    port: Number,
  },
};

describe('Mapping', () => {
  it('should parse simple mapping', () => {
    Object.assign(process.env, {
      MOE_GOOGLE_PROJECT_ID: 'quizizz-org',
      MOE_USE: 'false',
      MOE_MONGO_HOST: '127.0.0.1',
      MOE_MONGO_PORT: '27017',
      MOE_MONGO_DB: 'quizizz',
      MOE_MONGO_OPTIONS_READ_PREFERENCE: 'secondary',
      MOE_REDIS_CLUSTER_USE: 'true',
      'MOE_REDIS_CLUSTER_HOSTS_0_HOST': '127.0.0.1',
      'MOE_REDIS_CLUSTER_HOSTS_0_PORT': 6371,
      'MOE_REDIS_CLUSTER_HOSTS_1_HOST': '127.0.0.3',
      'MOE_REDIS_CLUSTER_HOSTS_1_PORT': 6372,
    });
    const config = parse(mapping, {
      prefix: 'MOE',
    });
    config.get = undefined;
    expect(JSON.parse(JSON.stringify(config))).to.deep.equal({
      google: {
        projectId: 'quizizz-org',
      },
      use: false,
      redis: {
        cluster: {
          use: true,
          hosts: [{
            host: '127.0.0.1',
            port: 6371,
          }, {
            host: '127.0.0.3',
            port: 6372,
          }],
        },
      },
      mongo: {
        host: '127.0.0.1',
        port: 27017,
        db: 'quizizz',
        options: {
          readPreference: 'secondary',
        },
      },
      un: {
        host: 'undefined',
        port: null,
      },
    });
  });
});
