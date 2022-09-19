const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
const {buscarTransacao} = require("./middlewares/index.js");
server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'GET' && req.originalUrl.includes("/transacao")) {
    res.status(200).json(buscarTransacao());
    return;
  }
  // Continue to JSON Server router
  next();
})

server.use(router);

server.listen(port);
