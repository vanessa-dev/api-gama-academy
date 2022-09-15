const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { categoria } = JSON.parse(fs.readFileSync('db.json'), {encoding:'utf8'});


function createCategory(req, res) {
  res.status(201).json({status: "201", message: "Funcionou!!!"});
  return;
}

function listCategory (req, res) {
  const empty_object_params = Object.entries(req.params).length === 0;
  const empty_object_query = Object.entries(req.query).length === 0;
  if (!empty_object_params) {
    console.log(req.params);
    const category_filter =   categoria.filter( item => item.id == req.params.id);
    res.status(200).json(category_filter);
  } else if (!empty_object_query) {
    const category_filter_query =   categoria.filter(item => item.tipo == req.query.tipo);
    res.status(200).json(category_filter_query);
  } else {
    res.status(200).json(categoria);
  }
 
}
// server.delete('/categoria',  (req, res, next) => {
//   res.status(201).json({status: "201", message: "Funcionou!!!"});
//   return;
// });

module.exports = {createCategory, listCategory}