const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom middleware to preserve the id field when posting
server.post('/txns', (req, res, next) => {
  // If the request body contains an id, preserve it
  if (req.body && req.body.id) {
    const id = req.body.id;
    const db = router.db;
    const txns = db.get('txns').value();
    
    // Check if transaction with this id already exists
    const existingIndex = txns.findIndex(t => t.id == id);
    
    if (existingIndex >= 0) {
      // Update existing
      txns[existingIndex] = req.body;
      db.set('txns', txns).write();
      res.status(200).json(req.body);
    } else {
      // Add new with provided id
      txns.push(req.body);
      db.set('txns', txns).write();
      res.status(201).json(req.body);
    }
  } else {
    // Let json-server handle it normally (generate id)
    next();
  }
});

server.use(router);
server.listen(9999, () => {
  console.log('JSON Server is running on port 9999');
});
