require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.SECRET_KEY;
const expiresIn = '1d';
const userdb = JSON.parse(fs.readFileSync('users.json', {encoding:'utf8'}));


function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Checando se o usuario existe no banco de dados.
function isAuthenticated({email, password}){
  const user_from_db = userdb.users.find(user => user.email === email);
  return user_from_db && bcrypt.compareSync(password, user_from_db.password);
}

function createUser (req, res)  {
  const {email, password} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const email_existente = userdb.users.findIndex(user => user.email === email);
  if(email_existente !== -1) {
    const status = 401;
    const message = 'Email já existe.';
    res.status(status).json({status, message});
    return
  }

  fs.readFile("./users.json", (err, data) => {  
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
    };

    var data = JSON.parse(data.toString());
    var last_item_id = data.users[data.users.length-1].id;

    //Adicionando novo usuário
    data.users.push({id: last_item_id + 1, email: email, password: hash});
    var writeData = fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        }
    });
  });

  // Criando token para novo usuário
  const access_token = createToken({email, password})
  res.status(200).json({access_token})
}

function login (req, res)  {
  const {email, password} = req.body;

  if (isAuthenticated({email, password}) === false) {
    const status = 401
    const message = 'Email ou senha inválido.'
    res.status(status).json({status, message})
    return;
  }
  const access_token = createToken({email, password});
  res.status(200).json({access_token});
}

function verifyAuth (req, res, next) {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Erro no formato do token de  autorização'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401;
      const message = 'Token de acesso não fornecido';
      res.status(status).json({status, message});
      return;
    }
    next()
  } catch (err) {
    const status = 401;
    const message = 'Token expirado';
    res.status(status).json({status, message});
  }
}

module.exports = {createUser, login, verifyAuth};