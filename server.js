const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
const {buscarTransacao, gerarUID, LancamentoComCategoria} = require("./middlewares/index.js");
server.use(middlewares);

//middleware
// server.use(jsonServer.bodyParser);
// server.use((req, res, next) => {
//   if (req.method === 'GET' && req.originalUrl.includes("/transacao")) {
//     res.status(200).json(buscarTransacao());
//     return;
//   }

//   if (req.method === 'POST') {
//     req.body.id = gerarUID();
//     next();
//     return;
//   }

//   if (req.method === 'DELETE' && req.originalUrl.includes("/categoria")) {
//     if(LancamentoComCategoria) {
//       res.status(403).json({message: "Não e possivel excluir essa categoria, pois existe transação associada a ela"});
//       return;
//     }
//     next();
//   }
//   // Continue to JSON Server router
//   next();
// })

server.use(router);

server.listen(port);
