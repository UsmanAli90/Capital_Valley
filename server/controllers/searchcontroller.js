const Investor = require("../models/Investordb");
const Startup = require("../models/Startupdb");

const searchProfiles = async (req, res) => {
  const { query } = req.query;
  console.log(req.query)

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const investors = await Investor.find({ username: new RegExp(query, "i") });
    const startups = await Startup.find({ username: new RegExp(query, "i") });

    res.status(200).json({ investors, startups });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { searchProfiles };
