const express = require("express");
const cors = require("cors"); // Only declare once
const dotenv = require("dotenv");
const connectDB = require('./db.js');
const Startup = require('./models/Startupdb.js'); 
const { createStartup } = require('./controllers/startupsignup.js');
const { createInvestor } = require('./controllers/investorsignup.js');
const { StartupsignIn } = require('./controllers/startupsignin.js');
const { InvestorsignIn } = require('./controllers/investorsignin.js');
const { forgotPassword,verifyOTP } = require("./controllers/forgotPassword");
const { forgotPassword1,verifyOTP1 } = require("./controllers/forgotPasswordInvestor.js");
const {resetPassword} = require('./controllers/resetPassword.js');
const {resetPassword1} = require('./controllers/resetPasswordIvestor.js');
const {searchProfiles}=require('./controllers/searchcontroller.js')
const {createPost}=require('./controllers/PostUpload.js')


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors()); // Use CORS middleware only once

connectDB(process.env.MONGO_URI);

app.post("/startupsignup", createStartup);
app.post("/investorsignup", createInvestor);
app.post("/startupsignin", StartupsignIn);
app.post("/investorsignin", InvestorsignIn);
app.post("/forgot-password", forgotPassword);
app.post("/forgot-password1", forgotPassword1);
app.post("/verify-otp", verifyOTP);
app.use('/reset-password', resetPassword);
app.use('/reset-password1', resetPassword1);
app.get('/search',searchProfiles)
<<<<<<< HEAD
app.post("/verify-otp1", verifyOTP1);
=======
app.post("/posts", createPost);
>>>>>>> d1d8f11a9284e95798938a166fed57c2706eaf00


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
