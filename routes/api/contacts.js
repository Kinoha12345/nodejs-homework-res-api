const express = require('express');
const router = express.Router();
const fs = require('fs');
const ERROR_MESSAGE = require('../../err_message/err_message')
const Contact = require('../../db/contacts')

router.get('/', async (req, res, next) => {
  try {
        const contactList = await Contact.find();
        res.status(200).json(contactList);
        console.log(contactList);
      } catch (error){
        res.status(400).json({message: ERROR_MESSAGE.NOT_FOUND});
  }
  next();
})

router.get('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;

  Contact.findOne({ _id: contactId})
  .then(foundContact => {
    if (!foundContact) {
      return res.status(404).json({
        message: ERROR_MESSAGE.NOT_FOUND,
      })
    }
    res.status(200).json({ found_contact: foundContact})
  })
  .catch (error => res.status(400).json({error: error}))

  next();
})

router.post('/', async (req, res, next) => {
  const {name, email, phone} = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: ERROR_MESSAGE.MISSING_FIELD
    })
  }
  try {
    const addContact = new Contact({name, email, phone})
    const updateContact = await addContact.save();
    res.status(200).json({new_contact: addContact})
  } catch (error) {
    console.log(error);
  }
  next();
})

router.delete('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;

  Contact.findOneAndDelete({ _id: contactId })
    .then(foundContact => {
      if (!foundContact) {
        return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })
      }

      res.json({
        found_contact: foundContact,
        message: "Contact delete!",
      })
    })
    .catch( error => res.status(400).json({ error: error }))
  next();
})

router.put('/:contactId',  async (req, res, next) => {
  const contactId = req.params.contactId;
  const newFields = req.body;

  Contact.findOneAndUpdate(
    { _id: contactId },
    { $setOnInsert: { ...newFields} },
    { new: true, upsert: true},
  )
    .then(foundContact => {
      if (!foundContact) {
        return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })
      }

      res.json({ found_contact: foundContact })
    })
    .catch( error => res.status(400).json({ error: error }))
  next();
})

router.patch('/:contactId', (req, res) => {
  const contactId = req.params.contactId;
  const newFields = req.body;
  const {name, email, phone} = newFields;

  if (!name || !email || !phone) {
    return res.status(400).json({message: ERROR_MESSAGE.MISSING_FIELD})
  }

  Contact.findOneAndUpdate(
    { _id: contactId },
    { $set: newFields },
    { new: true, useFindAndModify: false },
  )
      .then(foundContact => {
        if (!foundContact) {
          return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })
        }

        res.json({ foundContact: foundContact})
      })
      .catch(error => res.status(400).json({ error: error }))
})

module.exports = router
