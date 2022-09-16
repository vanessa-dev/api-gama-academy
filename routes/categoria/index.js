const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { categoria, transacao } = JSON.parse(fs.readFileSync('db.json'), {encoding:'utf8'});


function createCategory(req, res) {
  fs.readFile("./db.json", (err, data) => {  
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
    };

    var data = JSON.parse(data.toString());
    const add_data =  {id: uuidv4(),  nome: req.body.nome, tipo: req.body.tipo};
    data.categoria.push(add_data);
    fs.writeFile("./db.json", JSON.stringify(data), (err, result) => {  
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

function listCategory (req, res) {
  const empty_object_params = Object.entries(req.params).length === 0;
  const empty_object_query = Object.entries(req.query).length === 0;
  if (!empty_object_params) {
    const category_filter =   categoria.filter( item => item.id == req.params.id);
    res.status(200).json(category_filter);
  } else if (!empty_object_query) {
    const category_filter_query =   categoria.filter(item => item.tipo == req.query.tipo);
    res.status(200).json(category_filter_query);
  } else {
    res.status(200).json(categoria);
  }
}

function updateCategory (req, res) {
  const empty_object_params = Object.entries(req.params).length === 0;
  if (!empty_object_params) {
    fs.readFile("./db.json", (err, data_categoria) => {  
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({status, message})
        return
      };
      
      var data_categoria = JSON.parse(data_categoria.toString());
      const { nome, tipo } = req.body;
      const data_update =  data_categoria.categoria.find(item => item.id == req.params.id);
      const index_update =  data_categoria.categoria.findIndex(item => item.id == req.params.id);

      if (index_update != -1) {
        const add_data =  {
          id:  req.params.id,
          tipo:  tipo ? tipo : data_update.tipo,
          nome:  nome ? nome : data_update.nome
        }

        data_categoria.categoria[index_update] = add_data;
        fs.writeFile("./db.json", JSON.stringify(data_categoria), (err, result) => {  
          if (err) {
            const status = 401
            const message = err
            res.status(status).json({status, message})
            return
          }
          res.status(200).json(add_data);
          return;
        });
      };
      res.status(404).json({message: "Categoria não encontrada."});
    });
  }
  res.status(400).json({message: "Necessario fornecer id da categoria a ser atualizada."});
}

function deleteCategory(req, res) {
  const empty_object_params = Object.entries(req.params).length === 0;
  if (!empty_object_params) {
    const transacao_filter =   transacao.filter( item => item.categoria == req.params.id);
    if(transacao_filter.length > 0) {
      res.status(403).json({message: "Não e possivel excluir essa categoria, pois existe transação associada a ela"});
    } else {
      fs.readFile("./db.json", (err, data) => {  
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        };
        
        var data = JSON.parse(data.toString());
        const delete_category =  data.categoria.findIndex(item => item.id == req.params.id );
        data.categoria.splice(delete_category, 1);
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
  res.status(400).json({message: "Necessario fornecer id da categoria a ser deletada."});
}

module.exports = {createCategory, listCategory, updateCategory, deleteCategory}