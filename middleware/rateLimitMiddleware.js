const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: "Too many messages. Please wait a moment before sending again."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiLimiter,
    authLimiter,
    chatLimiter
};
