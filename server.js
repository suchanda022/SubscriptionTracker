const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/db");
const authRoute = require("./routes/auth");
const subRoute = require("./routes/subscription");
const paymentRoute = require("./routes/payment");
const {runReminderCron} = require("./cronjobs/reminder");


const { errorHandler, notFound } = require("./middleware/errorHandler");
const { required } = require("joi");

const app = express();

app.use(express.json());


app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

dbConnect();
runReminderCron();

app.use("/api/auth", authRoute);

// sub route

app.use("/api/sub", subRoute);

app.use("/api/payments", paymentRoute);

app.use(errorHandler);
app.use(notFound);

app.get("/", (req, res) => {
  res.send("welcome to subscription tracker api");
});

app.listen(3000, () => console.log("server up running"));
