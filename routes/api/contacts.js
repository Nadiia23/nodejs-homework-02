const express = require('express');

const Joi = require("joi");

const contacts = require("../../models/contacts");

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const router = express.Router();

const createError = require("../../helpers/createError");

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
}); 

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw createError(404, "Not Found");
    }
    res.status(200).json(result); 
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      throw createError(404, error.message);
    }
    const { name, email, phone } = req.body;
    const result = await contacts.addContact(name, email, phone);
    res.status(201).json(result);
  } catch (error) {
next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId} = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
     throw createError(404, "Not Found");
    }
    res.status(200).json({message: "Contact deleted"})
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
 const { error } = contactsSchema.validate(req.body);
    if (error) {
      throw createError(404, error.message);
    }
    const {contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw createError(404, "Not Found");
    }
    return result;
  } catch (error) { 
    next(error);
  }
})

module.exports = router
