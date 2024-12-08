const Filter = require("bad-words");
const validator = require("validator");
const dotenv = require("dotenv");

dotenv.config();

const filter = new Filter();
const badWords = process.env.BAD_WORDS.split(",");
filter.addWords(...badWords);

const containsProhibitedContent = (text) => {
    console.log("Checking text:", text);
  
    const isProfane = filter.isProfane(text);
    console.log(`Profanity check result for "${text}":`, isProfane);
  
    if (isProfane) {
      console.log("Text contains prohibited words.");
      return true;
    }
  
    // Check for phone numbers, email, and URLs
    const phoneRegex = /\b\d{10,11,12}\b/g;
    const partialEmailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\b/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
  
    const matchesPhone = phoneRegex.test(text);
    const matchesEmail = partialEmailRegex.test(text);
    const matchesURL = urlRegex.test(text);
  
    console.log("Phone match:", matchesPhone);
    console.log("Email match:", matchesEmail);
    console.log("URL match:", matchesURL);
  
    return matchesPhone || matchesEmail || matchesURL;
  };
  

const filterAndValidatePost = (req, res, next) => {
  try {
    const { problem, solution } = req.body;

    if (containsProhibitedContent(problem) || containsProhibitedContent(solution)) {
      return res.status(400).json({
        error: "Your post contains prohibited content. Please revise this mannnnnnnnnn and try again.",
      });
    }

    next(); 
  } catch (error) {
    console.error("Error in content validation:", error);
    res.status(500).json({ error: "Failed to validate content" });
  }
};

module.exports = { filterAndValidatePost };
