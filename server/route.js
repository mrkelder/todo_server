async function route(fastify, object) {

  const { assert } = object;

  fastify.get('/getTasks', (req, reply) => {
    // Gets tasks
    fastify.mongodb(({ db, client }) => {
      db.collection('tasks').find(JSON.parse(req.query.rule)).sort({ completed: 1 }).toArray((err, arr) => {
        assert.equal(err, null)
        reply.code(200).header('Access-Control-Allow-Origin', '*').send(arr);
        client.close();
      })
    });
  });

  fastify.get('/deleteTask', (req, reply) => {
    // Deletes task
    fastify.mongodb(({ db, mongodb, client }) => {
      db.collection('tasks').removeOne({ _id: mongodb.ObjectID(req.query._id) }, err => {
        assert.equal(err, null);
        reply.code(200).header('Access-Control-Allow-Origin', '*').send('');
        client.close();
      });
    });
  });

  fastify.get('/addTask', (req, reply) => {
    // Adds tasks
    fastify.mongodb(({ db, client }) => {
      db.collection('tasks').insertOne({ name: req.query.name, completed: false }, (err, res) => {
        assert.equal(err, null);
        reply.code(200).header('Access-Control-Allow-Origin', '*').send(res.insertedId);
        client.close();
      });
    });
  });

  fastify.get('/completeTask', (req, reply) => {
    // Completes task
    fastify.mongodb(({ db, mongodb, client }) => {
      db.collection('tasks').updateOne({ _id: mongodb.ObjectID(req.query._id) }, { $set: { completed: !JSON.parse(req.query.completed) } }, err => {
        assert.equal(err, null);
        reply.code(200).header('Access-Control-Allow-Origin', '*').send('');
        client.close();
      });
    });
  });

}

module.exports = route;