/* eslint-disable class-methods-use-this,prefer-const,no-const-assign */
// noinspection ES6MissingAwait,JSCheckFunctionSignatures

const uuid = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { Item, ItemInfo } = require('../db/models/models');
const ApiError = require('../exceptions/ApiError');

class ItemController {
  // ----------------------- Создание айтема --------------------------------
  async create(req, res, next) {
    try {
      let {
        name, value, cardId, tagId, info,
      } = req.body;
      // Принимаем файл с req.files

      const { image } = req.files;
      const fileName = `${uuid.v4()}.jpg`;
      // Перемещаем файл в нужную папку
      image.mv(path.resolve(process.env.PWD, 'public', 'img', fileName));

      // Создаем айтем
      const item = await Item.create({
        name, value, cardId, tagId, image: fileName,
      });

      // Создание карточки инфо айтема
      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => ItemInfo.create({
          title: i.title,
          description: i.description,
          itemId: item.id,
        }));
      }

      res.json(item);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  // -----------------------^^ Создание айтема ^^-------------------------------

  // ------------------ Получение всех айтемов с условием ----------------------
  async getAll(req, res) {
    // Забираем cardId, tagId со строки запроса устанавливаем лимит айтемов и страниц
    let {
      cardId, tagId, limit, page,
    } = req.query;

    // Устанавливаем лимит единовременно выведенных айтемов на страницу
    page = page || 1;
    limit = limit || 9;
    const offset = page * limit - limit;

    let items;
    if (!tagId && !cardId) {
      items = await Item.findAndCountAll({ limit, offset });
    }
    if (tagId && !cardId) {
      items = await Item.findAndCountAll({ where: { tagId, limit, offset } });
    }
    if (!tagId && cardId) {
      items = await Item.findAndCountAll({ where: { cardId, limit, offset } });
    }
    if (tagId && cardId) {
      items = await Item.findAndCountAll({
        where: tagId, cardId, limit, offset,
      });
    }
    return res.json(items);
  }
  // ------------------^^ Получение всех айтемов с условием ^^----------------

  // ---------- Получение одного айтема с массивом характеристик -------------
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Item.findOne({
        where: { id },
        include: [{ model: ItemInfo, as: 'info' }],
      });
      res.json(item);
    } catch (e) {
      next(ApiError.badRequest('Айтем не найден'));
    }
  }
  // ---------- Получение одного айтема с массивом характеристик -------------

  async update(req, res) {

  }

  // ------------------------- Удаление айтема и картинки ---------------------
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const i = await Item.findOne({ where: { id } });
      await fs.unlink(path.resolve(process.env.PWD, 'public', 'img', i.image));
      const item = await Item.destroy({ where: { id } });
      res.json(item);
    } catch (e) {
      next(ApiError.badRequest('Айтем не найден'));
    }
  }
}

module.exports = new ItemController();
