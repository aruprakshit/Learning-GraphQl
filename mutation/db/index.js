const Sequelize = require('sequelize');
const path = require('path');

const connection = new Sequelize('graphql-mutation', '', '', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: path.resolve(process.cwd(), 'db/mutation.sqlite')
});

if (process.env.DB_CONNECTION_TEST) {
  connection
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

const Post = connection.define('posts', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
  date: Sequelize.DATE,
  slug: Sequelize.STRING,
  category: Sequelize.STRING
});

const Review = connection.define('reviews', {
  body: Sequelize.STRING,
  stars: { type: Sequelize.INTEGER, defaultValue: 0 }
});

Review.belongsTo(Post);
Post.hasMany(Review);

// connection.sync({force: true});
connection.sync();

module.exports = {
  Review,
  Post
};