// Set up rate limiter: maximum of fifteen requests per minute
const RateLimit = require("express-rate-limit");
const  limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15,
});

module.exports = limiter