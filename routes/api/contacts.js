const express = require('express');

const router = express.Router();
const fs = require('fs');
const funContacts = require('../../models/contacts');
const ERROR_MESSAGE = require('../../err_message/err_message')
const {addValid} = require('../../middlewares/joi');

const contacts = JSON.parse(
  fs.readFileSync('../../models/contacts.json', {encoding: 'utf-8'}),
)

router.get('/', async (req, res, next) => {
  const contactList = await funContacts.listContacts();
  res.status(200).json( contactList);
  next();
})

router.get('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  const findContact = await funContacts.getContactById(Number(contactId), ERROR_MESSAGE.NOT_FOUND)
  if (!findContact) {
    return res.status(404).json({message: ERROR_MESSAGE.NOT_FOUND})
  }

  res.status(200).json({findContact})
  next();
})

router.post('/', addValid, async (req, res, next) => {
  const {name, email, phone} = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: ERROR_MESSAGE.MISSING_FIELD
    })
  }

  const addContact = await funContacts.addContact(name, email, phone)
  res.status(201).json(addContact);
  next();
})

router.delete('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;

  const deleteContact = await funContacts.removeContact(Number(contactId), ERROR_MESSAGE.NOT_FOUND)
  
  if (deleteContact.length === contacts.length) {
    return res.status(400).json({message: ERROR_MESSAGE.NOT_FOUND})
  }

  res.status(200).json({message: 'Contact delete'})
  next();
})

router.put('/:contactId', addValid, async (req, res, next) => {
  const contactId = req.params.contactId;
  const {name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: ERROR_MESSAGE.MISSING_FIELD})
  }

  const updateContact = await funContacts.updateContact(
    Number(contactId),
    name, email, phone,
    ERROR_MESSAGE.NOT_FOUND
  )

  if (!updateContact) {
    return res.status(404).json({message: ERROR_MESSAGE.NOT_FOUND})
  }
  res.status(200).json({ message: "Contact update" });
  next();
})

module.exports = router
