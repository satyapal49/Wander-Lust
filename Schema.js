const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        tittle : Joi.string().required(),
        description : Joi.string().required(),
        country : Joi.string().required(),
        location : Joi.string().required(),
        image : Joi.string().required(),
        price : Joi.number().required(),

    }).required()
})

module.exports = listingSchema;