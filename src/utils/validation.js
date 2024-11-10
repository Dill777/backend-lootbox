const Joi = require("joi");

const openLootBoxSchema = Joi.object({
    lootBoxId: Joi.string().length(24).hex().required().messages({
        "string.base": `"lootBoxId" should be a type of 'text'`,
        "string.length": `"lootBoxId" should be exactly 24 characters`,
        "string.hex": `"lootBoxId" should only contain hexadecimal characters`,
        "any.required": `"lootBoxId" is a required field`,
    }),
    userId: Joi.string().length(24).hex().required().messages({
        "string.base": `"userId" should be a type of 'text'`,
        "string.length": `"userId" should be exactly 24 characters`,
        "string.hex": `"userId" should only contain hexadecimal characters`,
        "any.required": `"userId" is a required field`,
    }),
});

const joinSchema = Joi.string().length(24).hex().required().messages({
    "string.base": `"userId" should be a type of 'text'`,
    "string.length": `"userId" should be exactly 24 characters`,
    "string.hex": `"userId" should only contain hexadecimal characters`,
    "any.required": `"userId" is a required field`,
});

module.exports = {
    openLootBoxSchema,
    joinSchema,
};
