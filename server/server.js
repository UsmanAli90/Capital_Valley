const express = require("express")
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./db.js');
const Startup = require('./models/Startupdb.js'); 


dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());
connectDB(process.env.MONGO_URI);

app.post('/')


app.post("/startupsignup", async (req, res) => {
    try {
        const { email, username, password, cnic, description } = req.body;
        startupDescription= description;
        const newStartup = new Startup({ email, username, password, cnic, startupDescription });
        const savedStartup = await newStartup.save();

        res.status(201).json({ message: "Startup created successfully", savedStartup });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email or CNIC already exists" });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
