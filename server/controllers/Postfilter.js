const Filter = require("bad-words");
const validator = require("validator");
require("dotenv").config();

const filter = new Filter();
const badWords = process.env.BAD_WORDS.split(",");
filter.addWords(...badWords);

const containsProhibitedContent = (text) => {

  if (filter.isProfane(text)) return true;

  const phoneRegex = /\b\d{10,11,12}\b/g; 
  const partialEmailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\b/g; 
  const urlRegex = /(https?:\/\/[^\s]+)/g; 

  if (
    phoneRegex.test(text) || 
    partialEmailRegex.test(text) || 
    urlRegex.test(text)
  ) {
    return true;
  }

  const words = text.split(/\s+/); 
  for (const word of words) {
    if (validator.isEmail(word)) {
      return true; 
    }
  }

  return false;
};

const filterAndValidatePost = (req, res, next) => {
  try {
    const { problem, solution } = req.body;

    if (containsProhibitedContent(problem) || containsProhibitedContent(solution)) {
      return res.status(400).json({
        error: "Your post contains prohibited content. Please revise and try again.",
      });
    }

    next(); 
  } catch (error) {
    console.error("Error in content validation:", error);
    res.status(500).json({ error: "Failed to validate content" });
  }
};

module.exports = { filterAndValidatePost };
