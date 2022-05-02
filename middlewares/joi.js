const Joi = require('joi')

module.exports = {
    addValid: (req, res, next) => {

        const valid = Joi.object({
            name: Joi.string()
            .min(2)
            .max(30)
            .required(),
            email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
            phone: Joi.string().required(),

            
        })
        const result = valid.validate(req.body)

        if (result.error) {
            return res.status(400).json({ message: "error in one of the input fields" })
        }

        next();
    },
};