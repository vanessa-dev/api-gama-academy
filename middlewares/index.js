const fs = require('fs');
const { transacao, categoria } = JSON.parse(fs.readFileSync('db.json'), {encoding:'utf8'});

function retornaTransacaoComCategoria (item) {
  let obj_categoria = categoria.find(item_categoria => item.categoria == item_categoria.id);
  return {
   id: item.id,
   valor: item.valor,
   categoria: obj_categoria,
   descricao: item.descricao,
   data: item.data
  }
}

function buscarTransacao() {
 return transacao.map(retornaTransacaoComCategoria);
}

module.exports = {buscarTransacao}