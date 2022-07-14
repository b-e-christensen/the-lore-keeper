const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    files: [File]
  }

  type File {
    _id: ID
    name: String
    categories: [Category]
  }

  type Tag {
    name: String
  }
  
  type Description {
    name: String
    description: String
  }

  type Nests {
    name: String
  }

  type Category {
    _id: ID
    name: String
    description: [Description]
    tags: [Tag]
    nestedDocuments: [Nests]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user: [User]
    me: User
    categories: [Category]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addFile(name: String!, user_id: String!, parentCategory: String!): File
    addCategory(name: String!, file_id: String!, parentCategory_id: String!): Category
    addTag(firstCategory_id: String!, secondCategory_id: String!, file_id: String!): Category
    addDescription(category_id: String!, name: String!, description: String!): Category
  }
`;

module.exports = typeDefs;
