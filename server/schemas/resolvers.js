const { AuthenticationError } = require('apollo-server-express');
const { User, Category, Content } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      return User.find()
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    categories: async (parent, args) => {
      const categories = await Category.find().populate('content')
      console.log(categories[0].content)
      return categories
    },
    contents: async (parent, args) => {
      const contents = await Content.find().populate('tags')
      console.log(contents)
      return contents
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addCategory: async (parent, { name }, context) => {
      const category = await Category.create({ name })

      return category
    },
    //add content
    addContent: async (parent, { name, category_id }, context) => {
      const content = await Content.create({ name })

      await Category.findOneAndUpdate(
        { _id: category_id },
        { $addToSet: { content: content._id }},
        { runValidators: true, new: true })

      return content
    },
    //add tag
    addTag: async (parent, { nameOfTag, _id }, context) => {
      const content = await Content.findOne({ name: nameOfTag })
      const category = await Category.findOne({ name: nameOfTag })
      if(!content && !category) {
        throw new AuthenticationError('Tags can only be given of existing categories or content within those categories.')
      }
      const taggedContent = Content.findOne({ _id })
      const taggedCategory = Category.findOne({ _id })
      if(taggedContent) {
        return await taggedContent.updateOne({ $addToSet: { tags: { name: nameOfTag } }})
      } else if (taggedCategory) {
        return await taggedCategory.updateOne({ $addToSet: { tags: { name: nameOfTag } }})
      }
    },

  },
};

module.exports = resolvers;
