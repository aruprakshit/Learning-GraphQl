const express = require('express');
const graphql = require('express-graph.ql');
const Schema = require('./schema.js');

const app = express();

app.post('/query', graphql(Schema));

app.listen(5000, () => {
  console.log("Listening on port 5000");
})
