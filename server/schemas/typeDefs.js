const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Tag {
    name: String
  }

  type Category {
    _id: ID
    name: String
    content: [Content]!
    contentSchema: String
    tags: [Tag]!
  }

  type Content {
    _id: ID
    name: String
    description: [Description]!
    tags: [Tag]!
  }

  type Description {
    description: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user: User
    me: User
    categories: [Category]
    contents: [Content]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addCategory(name: String!): Category
    addContent(name: String!, category_id: String!): Content
    addTag(nameOfTag: String!, _id: String!): Content
  }
`;

module.exports = typeDefs;
