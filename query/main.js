var Schema = require('graph.ql');

module.exports = loader => (
  Schema(`
    scalar Date

    type Character {
      name: String!
      gender: String
      eye_color: String
      homeworld(): Planet
      films(): [Film]
    }

    type Film {
      title: String!
      producers(): [String]
      characters(limit: Int): [Character]
      release_date: Date
    }

    type Planet {
      name: String!
      population: String
      gravity: String
      films(): [Film]
      residents(): [Character]
    }

    # these are the queries available in this server
    type Query {
      # find a film by id
      find_film(id: Int): Film
      # find a character by id
      find_chracter(id: Int): Character
      # find a planet by id
      find_planet(id: Int): Planet
    }
  `,{
    Date: {
      serialize(date) {
        return new Date(date);
      }
    },
    Character: {
      homeworld(character, args) {
        return loader.planet.load(character.homeworld);
      },
      films(character, args) {
        return loader.film.loadMany(character.films);
      }
    },
    Film: {
      producers(film, args) {
        return film.producer.split(/\s*,\s*/);
      },
      characters(film, args) {
        var characters = args.limit
          ? film.characters.slice(0, args.limit)
          : film.characters


        return loader.character.loadMany(characters);
      }
    },
    Planet: {
      films(planet, args) {
        return loader.film.loadMany(planet.films);
      },
      residents(planet, args) {
        return loader.character.loadMany(planet.residents);
      }
    },
    Query: {
      find_film(query, args) {
        return loader.film.load(args.id);
      },
      find_chracter(query, args) {
        console.log(loader);
        return loader.character.load(args.id);
      },
      find_planet(query, args) {
        console.log(loader);
        return loader.planet.load(args.id);
      }
    }
  })
);


// schema(`
//   query find($film: Int, $limit: Int) {
//     flim: find_film(id: $film) {
//       title
//       release_date
//       producers
//       characters(limit: $limit) {
//         name
//         gender
//         eye_color
//
//         homeworld {
//           name
//           population
//         }
//
//         films {
//           title
//         }
//       }
//     }
//   }
// `, {
//   film: 3,
//   limit: 2
// }).then(function (res) {
//   console.dir(res, {depth: null, colors: true});
// })
//
// // watching 002
