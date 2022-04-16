/* eslint-disable */
// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line import/no-unresolved

require('dotenv').config();

// connect necessary methods from falso for seeding
const { randPassword, randEmail, randFullName } = require('@ngneat/falso');
const sequelize = require('../db');
const {
  User, Favorite, FavoriteItem, Item, Card, Tag, Rating, CardTag, ItemInfo,
} = require('../models/models');

module.exports = {
  // sync database
  syncDb: async () => await sequelize.sync(),

  // force sync database (! destroy all data in tables)
  syncDbForce: async () => await sequelize.sync({ force: true }),

  // no comments)))
  dropDb: async () => await sequelize.drop(),

  // seeder (you can choose quantity in script)
  seedDb: async (amount) => {
    while (amount--) {
      await User.create({
        name: randFullName(),
        email: randEmail(),
        password: randPassword(),
      });
    }
  },
};
// !necessary for running functions separately
require('make-runnable');
