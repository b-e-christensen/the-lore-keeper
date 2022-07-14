const { AuthenticationError } = require('apollo-server-express');
const { User, Category, File } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args) => {
      return await User.find().populate('files').populate({path: 'files', populate: 'categories'})
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    categories: async (parent, args) => {
      const categories = await Category.find()

      return categories
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

    //CHANGED SCHEMAS!! will need to update these resolvers to reflect new layout (categories being saved to files, which is stored in the user model, instead of categories being stored directly in the user. allows for user to have several structures of data.)
    
    addFile: async (parent, { name, user_id }, context) => {
      const file = await File.create({ name })

      await User.findByIdAndUpdate(
        { _id: user_id },
        { $addToSet: { files: file.id }})

        return file
    },

    //route tested and working! some changes will need to be made to utilize context in live app
    addCategory: async (parent, { name, file_id, parentCategory_id }, context) => {
      const category = await Category.create({ name })

      if(parentCategory_id) {
        await Category.findOneAndUpdate(
          { _id: parentCategory_id },
          { $addToSet: { nestedDocuments: { name: category.name }}})
      }

      await File.findOneAndUpdate(
        { _id: file_id },
        { $addToSet: { categories: category.id } })

      return category
    },

    //route tested and working! 
    addDescription: async (parent, { category_id, name, description }, context) => {
      const category = await Category.findOneAndUpdate(
        { _id: category_id },
        { $addToSet: { description: { name, description } } },
        { runValidators: true, new: true })

      return category
    },

    addTag: async (parent, { firstCategory_id, secondCategory_id, file_id }, context) => {
      const firstCategory = await Category.findOne({ _id: firstCategory_id })
      const secondCategory = await Category.findOne({ _id: secondCategory_id })
      const file = await File.findOne({ _id: file_id })

      if (!file.categories.includes(secondCategory.id)) {
        throw new AuthenticationError('Tags can only be given of existing categories.')
      }

      await firstCategory.updateOne(
        { $addToSet: { tags: { name: secondCategory.name } } },
        { runValidators: true, new: true })
      return await secondCategory.updateOne(
        { $addToSet: { tags: { name: firstCategory.name } } },
        { runValidators: true, new: true })
    },

    //addNestedDocs

  },
};

module.exports = resolvers;
