var express = require('express');
var graphql = require('express-graph.ql');
var Schema = require('./main.js');
var loader = require('./loader.js');

var app = express();

app.use((req, res, next) => {
  req.loader = loader();
  next();
});

app.post('/query', (req, resp, next) => {
  return graphql(Schema(req.loader))(req, resp, next);
});

app.get('/', (req, resp) => {
  const withCharacters = req.query.withCharacters === "true" ? true : false;

  Schema(req.loader)(`
    query find($film: Int!, $withCharacters: Boolean!) {
      find_film(id: $film) {
        title
        release_date
        producers @skip(if: $withCharacters)
        characters(limit: 4) @include(if: $withCharacters) {
          name
          eye_color
          gender
          homeworld {
            name
            population
          }
        }
      }
    }
  `, {
    film: 1,
    withCharacters
  })
  .then(result => {
    return resp.send(result);
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
})
