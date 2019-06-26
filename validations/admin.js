const joi = require("@hapi/joi");

module.exports.regValidation = (data) => {
    console.log(data);

    const compareWith = {
        regNo: joi.string().min(6).required(),
        username: joi.string().min(5).required(),
        email: joi.string().min(6).email().required(),
        password: joi.string().min(6).required(),
        confirmPassword: joi.string().min(6).required()
    }
    return joi.validate(data, compareWith);
};