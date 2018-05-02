const Schema = require("graph.ql");

const DATA = [
  { username: "catherine" },
  { director: "catherine hardwicke" },
  { author: "catherine cookson", isbn: "IO19939" }
];

const schema = Schema(
  `
  interface SearchableType {
    searchPreviewText: String
  }

  type User implements SearchableType {
    username: String
    searchPreviewText: String
  }

  type Movie implements SearchableType {
    director: String
    searchPreviewText: String
  }

  type Book implements SearchableType {
    author: String
    isbn: String
    searchPreviewText: String
  }

  type Query {
    search(text: String!): [SearchableType]
  }
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
    User: {
      isTypeOf(data) {
        return !!data.username;
      },
      searchPreviewText(data) {
        return `(user) ${data.username}`;
      }
    },
    Movie: {
      isTypeOf(data) {
        return !!data.director;
      },
      searchPreviewText(data) {
        return `(movie) ${data.director}`;
      }
    },
    Book: {
      isTypeOf(data) {
        return !!data.author;
      },
      searchPreviewText(data) {
        return `(user) ${data.author}`;
      }
    }
  }
);

schema(`
  {
    search(text: "co") {
      searchPreviewText
      ... on User {
        username
      }
      ... on Movie {
        director
      }
      ... on Book {
        author
        isbn
      }
    }
  }
`).then(res => console.dir(res, { depth: null, colors: true }));

module.exports = schema;
