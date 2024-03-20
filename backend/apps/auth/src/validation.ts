import * as Joi from 'joi';

export const validateEnv = {
  AUTH_SERVER_PORT: Joi.number().port().default(3000),
  TASKS_SERVER_PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().required(),
};
