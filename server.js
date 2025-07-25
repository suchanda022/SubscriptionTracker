const express = require("express");

require("dotenv").config();
const dbConnect = require("./config/db");
const authRoute = require("./routes/auth");



const app = express();

app.use(express.json());

dbConnect();

app.use('/api/auth',authRoute);

app.get('/',(req,res) =>{
    res.send('welcome to subscription tracker api')
})

app.listen(3000, () => console.log("server up running"));
