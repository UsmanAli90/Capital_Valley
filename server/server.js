const express = require("express")
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./db.js');
const Startup = require('./models/Startupdb.js');
const { createStartup } = require('./controllers/startupsignup.js')
const { createInvestor } = require('./controllers/investorsignup.js')
const { StartupsignIn } = require('./controllers/startupsignin.js')
const { InvestorsignIn } = require('./controllers/investorsignin.js')
const { searchProfiles } = require('./controllers/searchcontroller.js')
const { createPost } = require('./controllers/PostUpload.js')



dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());
connectDB(process.env.MONGO_URI);

app.post("/startupsignup", createStartup);
app.post("/investorsignup", createInvestor);
app.post("/startupsignin", StartupsignIn);
app.post("/investorsignin", InvestorsignIn);
app.post("/posts", createPost);
app.get("/search", searchProfiles  )

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
