const express = require("express");
const Joi = require("joi");
const Contact = require("../../models/contact");
const createError = require("../../helpers/createError");
const authorize = require("../../middelwares/authorize");

const router = express.Router();

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

router.get("/", authorize, async (req, res, next) => {
  try {
    const { _id:owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find(
      favorite ? { owner, favorite } : { owner },
      "",
      {
        skip,
        limit: +limit,
      }
    ).populate("owner", "_id name email");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authorize, async (req, res, next) => {
  try {
    const { contactId:_id } = req.params;
    const result = await Contact.findById(_id);
    if (!result) {
      throw createError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", authorize, async (req, res, next) => {
  try {
    const { _id} = req.user;
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      throw createError(400, "missing required name field");
    }
    if (req.body.favorite === undefined) {
      req.body.favorite = false;
    }
    const result = await Contact.create({ ...req.body, owner: _id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", authorize, async (req, res, next) => {
  try {
    const { contactId: _id } = req.params;
    const { _id:owner} = req.user;
    const result = await Contact.findOneAndDelete({ _id, owner });
    if (!result) {
      throw createError(404, "Not Found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", authorize, async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }
    const { contactId: _id } = req.params;
    const { _id:owner} = req.user;
    const result = await Contact.findOneAndUpdate(
      { _id, owner},
      req.body,
      {
        new: true,
      }
    );
    if (!result) {
      throw createError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});


router.patch("/:contactId/favorite", authorize, async (req, res, next) => {
  try {
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw createError(400, { message: "missing field favorite" });
    }
    const result = await Contact.findOneAndUpdate(
      { _id, owner},
      req.body,
      { new: true }
    );
    if (!result) {
      throw createError(404, "Not Found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
