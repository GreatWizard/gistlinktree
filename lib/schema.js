import Joi from 'joi'

const copySchema = Joi.array().items(
  Joi.object({
    input: Joi.string().required(),
    output: Joi.string(),
  }),
)

const configSchema = Joi.object().keys({
  title: Joi.string().required(),
  avatar: Joi.string(),
  gravatar: Joi.string(),
  theme: Joi.string(),
  index: Joi.object({
    copy: copySchema,
  }),
  links: Joi.array().items(
    Joi.alternatives().try(
      Joi.object({
        outputDir: Joi.string().required(),
        gistID: Joi.string().required(),
        copy: copySchema,
      }),
      Joi.object({
        title: Joi.string().required(),
        url: Joi.string().required(),
      }),
    ),
  ),
  linksSocialPosition: Joi.string(),
  linksSocial: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
      url: Joi.string().required(),
    }),
  ),
})

export { configSchema }
