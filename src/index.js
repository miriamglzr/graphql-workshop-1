import { GraphQLServer } from "graphql-yoga";
import gql from "graphql-tag";

import db from "./db";

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Mutation {
  #  //createUser(id: ID!, name: String!, email: String!, age: Int): User!*/
  createUser(data: CreateUserInput)
  }

  type User {
    name: String!
    email: String!
    age: Int
    id: ID!
    posts: [Post!]!
  }

  type Post {
    title: String!
    body: String!
    id: ID!
    published: Boolean!
    author: User!
  }
  type Comment {
    id: ID!
    text: String!
    post:
  }
`;

const resolvers = {
  Query: {
    users() {
      return db.users;
    },

    user(_, args) {
      // _ underscore is a parent but is used when you don't need the info
      return db.users.find(user => user.id === args.id);
    },

    posts() {
      return db.posts;
    },

    comments() {
      return db.comments;
    }
  },
  Mutation: {
    createUser(_, args) {
      const newUser = {
        id: args.id,
        name: args.name,
        email: args.email,
        age: args.age
      };
    }
  },

  Post: {
    author(post) {
      return db.users.find(user => user.id === post.author);
    }
  },

  User: {
    posts(user) {
      return db.posts.filter(post => post.author === user.id);
    }
  },
  Comment: {
    post(comment) {
      return db.posts.find(post => post.id === comment.post);
    },

    author(comment) {
      return db.users.find(author => author.id === comment.author);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up!");
});
