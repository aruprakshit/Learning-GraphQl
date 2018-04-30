const Schema = require("graph.ql");
const Remarkable = require("remarkable");
const { Post, Review } = require("./db/index.js");

const remarkable = new Remarkable();
const toSlug = require("to-slug-case");

const posts = {};
const reviews = {};

module.exports = Schema(
  `
  scalar Markdown
  scalar Date

  enum Category {
    redis
    ruby
    elixir
    js
  }

  type Post {
    id: ID!
    title: String!
    date: Date!
    body: Markdown!
    slug: String!
    reviews(): [Review]!
    category: Category!
  }

  type Review {
    id: ID!
    body: String!
    stars: Int!
    post(): Post
  }

  input PostInput {
    title: String!
    date: Date!
    body: Markdown!
    category: Category!
  }

  input ReviewInput {
    body: String!
    stars: Int!
    post_id: String!
  }

  type Mutation {
    create_post(post: PostInput): Post
    create_review(review: ReviewInput): Review
  }

  type Query {
    all_posts(): [Post]!
    get_post(slug: String!): Post
    posts_by_category(category: Category!): [Post]!
  }
  `,
  {
    Date: {
      serialize(v) {
        return new Date(v);
      },
      parse(v) {
        const date = new Date(v);
        return date.toISOString();
      }
    },
    Markdown: {
      serialize(v) {
        return v;
      },
      parse(v) {
        return remarkable.render(v);
      }
    },
    Post: {
      reviews(post, args) {
        return Post.findById(post.id).then(post =>
          post.getReviews().then(reviews => reviews)
        );
      }
    },
    Review: {
      post(review, args) {
        return Post.findById(review.postId).then(post => post);
      }
    },
    Mutation: {
      create_post(mutation, args) {
        const slug = toSlug(args.post.title);

        const attrs = Object.assign({}, args.post, {
          slug
        });

        const post = Post.build(attrs);
        return post.save().then(record => record);
      },
      create_review(mutation, args) {
        const { body, stars, post_id } = args.review;
        const review = Review.build(
          Object.assign({}, { body, stars, postId: post_id })
        );
        return review.save().then(record => record);
      }
    },
    Query: {
      all_posts(query, args) {
        return Post.all().then(posts => posts);
      },
      get_post(query, args) {
        return Post.findOne({ where: { slug: args.slug } }).then(post => post);
      },
      posts_by_category(query, args) {
        return Post.findAll({ where: { category: args.category } }).then(
          projects => projects
        );
      }
    }
  }
);
