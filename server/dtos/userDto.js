// в класс dto передаем ту информацию которую будем хранить в payload
module.exports = class UserDto {
  id;

  name;

  email;

  isActivated;

  // принимает модель и достает необходимую информацию
  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
};
