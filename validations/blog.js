const joi = require("@hapi/joi");

module.exports.blogValidation = (data) => {
    console.log(data);

    const compareWith = {
            title: joi.string().min(6).max(300).required(),
            editor: joi.string().min(10).required()
    }
    return joi.validate(data, compareWith);
};