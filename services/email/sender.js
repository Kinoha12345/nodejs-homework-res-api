const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
require('dotenv').config()

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    return await sgMail.send({ ...msg, from: 'myts.vitaliy@meta.ua' })
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: 'myts.vitaliy@meta.ua',
        pass: process.env.PASSWORD,
      },
    }
    const transporter = nodemailer.createTransport(config)
    return await transporter.sendMail({ ...msg, from: 'myts.vitaliy@meta.ua' })
  }
}

module.exports = { CreateSenderSendGrid, CreateSenderNodemailer }