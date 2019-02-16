const PORT = 3333;
const express = require('express');

const app = express();

const duplicates = require('./duplicates/duplicates.controller')(express);

app.use('/duplicates', duplicates);

app.listen(PORT, 'localhost', async err => {
  if (err) {
    return console.error(err.message);
  }
  return console.log(`Duplicates app listening on port ${PORT}!`);
});
