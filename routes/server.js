require('dotenv').config();
const bodyParser = require('body-parser');
const jsonServer = require('json-server');

const {createUser, login, verifyAuth} = require("./auth/index.js");
const {createCategory, listCategory, updateCategory, deleteCategory} = require("./categoria/index.js");
const {createTransaction, listTransaction, updateTransaction, deleteTransaction} = require("./transacao/index.js");

const server = jsonServer.create();
const port = process.env.PORT || 4000;

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

//Rotas de usuario
server.post('/auth/register', (req, res) => createUser(req, res));
server.post('/auth/login', (req, res) => login(req, res));
server.use(/^(?!\/auth).*$/, (req, res, next) => verifyAuth(req, res, next));

// Rotas de Categoria
server.post('/categoria', (req, res) => createCategory(req, res));
server.get('/categoria', (req, res) => listCategory(req, res));
server.get('/categoria/:id', (req, res) => listCategory(req, res));
server.put('/categoria/:id', (req, res) => updateCategory(req, res));
server.delete('/categoria/:id', (req, res) => deleteCategory(req, res));

// Rotas de Transacoes
server.post('/transacao', (req, res) => createTransaction(req, res));
server.get('/transacao', (req, res) => listTransaction(req, res));
server.get('/transacao/:id', (req, res) => listTransaction(req, res));
server.put('/transacao/:id', (req, res) => updateTransaction(req, res));
server.delete('/transacao/:id', (req, res) => deleteTransaction(req, res));


server.listen(port);