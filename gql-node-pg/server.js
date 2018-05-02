const Express = require('express');
const GraphHTTP = require('express-graphql');
const Schema = require('./schema');


// Config
const APP_PORT = 3000;
const app = Express();

app.use("/graphql", GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(APP_PORT, () => {
  console.log(`App listening on port:${APP_PORT}`);
})
