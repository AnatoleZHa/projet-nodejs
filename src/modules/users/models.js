import joi from 'joi';

const model = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required(),
  firstName: joi.string(),
  lastName: joi.string(),
});

export const modelForUpdate = joi.object().keys({
  password: joi.string(),
  firstName: joi.string(),
  lastName: joi.string(),
});

export default model;
