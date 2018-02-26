
const { expect } = require('chai');
const { produce } = require('../src/index.js');

const config = {
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
        host: '127.0.0.2',
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
};


describe('Produce', () => {
  it('should produce values', () => {
    const str = produce(config, { prefix: 'MOE' });
    expect(str).to.deep.equal([
      'MOE_GOOGLE_PROJECT_ID=quizizz-org',
      'MOE_USE=false',
      'MOE_REDIS_CLUSTER_USE=true',
      'MOE_REDIS_CLUSTER_HOSTS[0]_HOST=127.0.0.1',
      'MOE_REDIS_CLUSTER_HOSTS[0]_PORT=6371',
      'MOE_REDIS_CLUSTER_HOSTS[1]_HOST=127.0.0.2',
      'MOE_REDIS_CLUSTER_HOSTS[1]_PORT=6372',
      'MOE_MONGO_HOST=127.0.0.1',
      'MOE_MONGO_PORT=27017',
      'MOE_MONGO_DB=quizizz',
      'MOE_MONGO_OPTIONS_READ_PREFERENCE=secondary',
      '',
    ].join('\n'));
  });
});
