// const fs = require('fs/promises')
const fs = require('fs');
const path = require('path');

const contPath = path.resolve('./contacts.json');
const contList = fs.readFileSync(contactsPath, 'utf-8');
const contacts = JSON.parse(contList);

const listContacts = async () => {
  console.table(await contacts);
  return contacts;
}

const getContactById = async (contactId, errMessage) => {
  const findContact = await contacts.find(contact => {
    if (contact.id === contactId) {
      console.table( contact);
      return contact;
    }
  })

  if(!findContact) { 
    console.log(errMessage);
  }
  
  return findContact
}

const removeContact = async (contactId, errMessage) => {
  const newContacts = await contacts.filter(contact => contact.id !== contactId);

  if (newContacts.length === contacts.length) {
    console.log(errMessage);
    return contacts;
  }

  console.table( await newContacts);

  fs.writeFile(contPath, JSON.stringify(newContacts), error => {
    if (error) {
      return console.log( error);
    }
  })
  return newContacts;
}

const addContact = async (name, email, phone) => {
  await contacts.push({
    id: contacts.length + 1,
    name: name,
    email: email,
    phone: phone
  })

  console.table( contacts);

    fs.writeFile(contPath, JSON.stringify(contacts), error => {
      if (error) {
       return console.log(error);
      }
    })

    return contacts;
}

const updateContact = async (contactId, name, email, phone, errMessage) => {
  const contact = await contacts.find(contact => {
    if(contact.id === contactId) {
      contact.name = name;
      contact.email = email;
      contact.phone = phone;
      console.table(contacts);
      return contact
    }
  })
    if(contact == null ) {
      return console.log(errMessage);
    }

    fs.writeFile(contPath, JSON.stringify(contacts), error => {
      if (error) {
        return console.log(error);
      }
    })
    return contacts;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
