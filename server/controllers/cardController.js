/* eslint-disable class-methods-use-this */
const { Card } = require('../db/models/models');
const ApiError = require('../exceptions/ApiError');

// noinspection JSCheckFunctionSignatures
class CardController {
  // Создание карточки
  async create(req, res) {
    const { name } = req.body;
    console.log(req.body);
    const card = await Card.create({ name });
    return res.json(card);
  }

  async delete(req, res) {
    const { id } = req.params;
    const card = await Card.destroy({ where: { id } });
    return res.json(card);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await Card.update({ name }, { where: { id } });
      res.status(200).json({ message: 'Карточка успешно изменена' });
    } catch (e) {
      next(ApiError.badRequest(e));
    }
  }

  async getAll(req, res) {
    const card = await Card.findAll();
    return res.json(card);
  }
}

module.exports = new CardController();
