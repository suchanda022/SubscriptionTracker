

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Subscription = require("./model/subscriptions"); // adjust path if needed

dotenv.config();

// Replace with your test user's ObjectId from DB
const TEST_USER_ID = "68ae209bb7baedb1085923b0";

const categories = [
  "entertainment",
  "education",
  "fitness",
  "cooking",
  "others",
];
const statuses = ["active", "expired"];
const frequencies = ["weekly", "monthly", "yearly"];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const subs = [];
    for (let i = 1; i <= 30; i++) {
      const startDate = new Date(
        Date.now() - Math.floor(Math.random() * 10000000000) // random past date
      );

      // expirey = add frequency duration to startDate
      let expirey = new Date(startDate);
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      if (freq === "weekly") expirey.setDate(expirey.getDate() + 7);
      if (freq === "monthly") expirey.setMonth(expirey.getMonth() + 1);
      if (freq === "yearly") expirey.setFullYear(expirey.getFullYear() + 1);
     const status = expirey < new Date()?"expired": "active";
      subs.push({
        user: TEST_USER_ID,
        subName: `Service ${i}`,
        amount: Math.floor(Math.random() * 1000) + 100, // between 100 and 1100
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        frequency: freq,
        startDate: startDate,
        expirey: expirey,
      });
    }

    await Subscription.insertMany(subs);
    console.log("✅ 30 subscriptions inserted for test user!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding subscriptions:", error);
    mongoose.connection.close();
  }
}

seed();

