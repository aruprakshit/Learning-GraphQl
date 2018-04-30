const Schema = require("graph.ql");

const DATA = [
  { username: "catherine" },
  { director: "catherine hardwicke" },
  { author: "catherine cookson" }
];

const schema = Schema(
  `
  type User {
    username: String
  }

  type Movie {
    director: String
  }

  type Book {
    author: String
  }

  type Query {
    search(text: String!): [SearchableType]
  }

  union SearchableType = User | Movie | Book
`,
  {
    Query: {
      search(query, args) {
        const text = args.text;

        return DATA.filter(d => {
          const searchableProperty = d.username || d.director || d.author;
          return searchableProperty.includes(text);
        });
      }
    },
    SearchableType: {
      resolveType(data) {
        if (data.username) {
          return "User";
        }

        if (data.director) {
          return "Movie";
        }

        if (data.author) {
          return "Book";
        }
      }
    },
    User: {},
    Movie: {},
    Book: {}
  }
);

schema(`
  {
    search(text: "hard") {
      ... on User {
        username
      }
      ... on Movie {
        director
      }
      ... on Book {
        author
      }
    }
  }
`).then(res => console.dir(res, { depth: null, colors: true }));
