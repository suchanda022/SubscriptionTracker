const cron = require("node-cron");
const Subscription = require("../model/subscriptions");
const User = require("../model/user");
const sendEmail = require("../utils/sendEmails");


const runReminderCron = () => {
  // Run every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running daily reminder email job...");

    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 3); // Reminder 3 days before expiry

    targetDate.setHours(0, 0, 0, 0); // Set to 00:00 of target day
    const nextDay = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    try {
      const subscriptions = await Subscription.find({
        expiryDate: {
          $gte: targetDate,
          $lt: nextDay,
        },
      }).populate("user"); // Make sure `user` is populated if ref

      if (!subscriptions.length) {
        console.log("✅ No subscriptions expiring in 3 days.");
        return;
      }

      for (let subscription of subscriptions) {
        await sendReminderEmail(subscription.user, subscription);
      }
    } catch (err) {
      console.error("❌ Error during reminder cron:", err.message);
    }
  });
};

module.exports = { runReminderCron };