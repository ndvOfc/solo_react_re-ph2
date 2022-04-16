/* eslint-disable class-methods-use-this */
const { Tag } = require('../db/models/models');

class TagController {
  async create(req, res) {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    return res.json(tag);
  }

  async getAll(req, res) {
    const tags = await Tag.findAll();
    return res.json(tags);
  }
}

module.exports = new TagController();
