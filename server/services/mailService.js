// Сервис для отправки писем
require('dotenv').config();
const nodemailer = require('nodemailer');

class MailService {
  // в конструкторе создаем функцию отправки писем и прописываем конфигурацию
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      pool: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Ссылка на активацию аккаунта на ${process.env.API_URL}`,
      text: 'Подтвердите свой email',
      html:
          `
          <div>
                <h1>Активируйте Ваш аккаунт</h1>
                <a href="${link}">${link}</a>
          </div>>
          `,
    });
  }
}

module.exports = new MailService();
