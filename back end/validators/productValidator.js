import Joi from 'joi';

const productSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    age: Joi.number().required(),
    price: Joi.number().required(),
    phone: Joi.number().required(),
    image: Joi.string(),
});

export default productSchema;