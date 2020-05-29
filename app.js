const fastify = require('fastify')();
const assert = require('assert');
const mongodb = require('mongodb');

fastify.decorate('mongodb', func => {
  // Mongodb decoration
  const MongoClient = mongodb.MongoClient;
  const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
  client.connect(err => {
    if (err) throw err;
    const db = client.db('todo');
    func({
      db: db,
      client: client,
      mongodb: mongodb
    });
  });
});

fastify.register(require('./server/route') , { assert: assert });

fastify.ready(err => {
  assert.equal(err, null);
  console.log('Listening at http://localhost:8080');
});

fastify.listen(8080);