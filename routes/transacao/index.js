const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { transacao } = JSON.parse(fs.readFileSync('db.json'), {encoding:'utf8'});


function createTransaction(req, res) {
  fs.readFile("./db.json", (err, data_transacao) => {  
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
    };

    var data_transacao = JSON.parse(data_transacao.toString());
    const { tipo, valor, categoria, descricao, data } = req.body;
    const add_data =  {
      id: uuidv4(),  
      tipo, 
      valor, 
      categoria, 
      descricao, 
      data
    };
    data_transacao.transacao.push(add_data);
    fs.writeFile("./db.json", JSON.stringify(data_transacao), (err, result) => {  
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({status, message})
        return
      }

      res.status(201).json(add_data);
    });
  });
}

function listTransaction (req, res) {
  const empty_object_params = Object.entries(req.params).length === 0;
  const empty_object_query = Object.entries(req.query).length === 0;
  if (!empty_object_params) {
    const transaction_filter =   transacao.filter( item => item.id == req.params.id);
    res.status(200).json(transaction_filter);
  } else if (!empty_object_query) {
    const transaction_filter_query =   transacao.filter(item => item.descricao == req.query.descricao);
    res.status(200).json(transaction_filter_query);
  } else {
    res.status(200).json(transacao);
  }
}

function updateTransaction (req, res) {

}

function deleteTransaction(req, res) {
  const empty_object_params = Object.entries(req.params).length === 0;
  if (!empty_object_params) {
    fs.readFile("./db.json", (err, data) => {  
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({status, message})
        return
      };
      
      var data = JSON.parse(data.toString());
      const delete_transaction =  data.categoria.findIndex(item => item.id == req.params.id );
      data.categoria.splice(delete_transaction, 1);
      fs.writeFile("./db.json", JSON.stringify(data), (err, result) => {  
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        }
        res.status(200).json({});
      });
    });
    
  }
}

module.exports = {createTransaction, listTransaction, updateTransaction, deleteTransaction}