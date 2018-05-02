const Sequelize = require('sequelize');
const _ = require('lodash');
const Faker = require('faker');

const Conn = new Sequelize('relay', '', '', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

const Person = Conn.define('person', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

const Post = Conn.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
})


// Relationships
Person.hasMany(Post);
Post.belongsTo(Person)

Conn.sync({force: true}).then(() =>{
  _.times(10, () => {
    return Person.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    }).then(person => {
       return person.createPost({
        title: Faker.lorem.sentence(),
        content: Faker.lorem.paragraph()
       })
    });
  });
});

module.exports = Conn;
