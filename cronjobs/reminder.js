const cron = require("node-cron");
const Subscription = require("../model/subscriptions");
const User = require("../model/user");
const sendEmail = require("../utils/sendEmails");
const submodel = require("../model/subscriptions");



// // Debug helper - run this once manually (call it from a route or from top-level)
// async function debugReminderQuery() {
//   const today = new Date();
//   today.setHours(0,0,0,0);

//   const threeDaysfromNow = new Date(today);
//   threeDaysfromNow.setDate(today.getDate() + 3);
//   threeDaysfromNow.setHours(23,59,59,999);

//   console.log("TODAY:", today.toISOString());
//   console.log("THREE_DAYS_FROM_NOW:", threeDaysfromNow.toISOString());

//   const all = await submodel.find().lean(); // get all docs
//   console.log("TOTAL SUBSCRIPTIONS:", all.length);

//   all.forEach(doc => {
//     const e = doc.expirey ? new Date(doc.expirey) : null;
//     console.log("----");
//     console.log("id:", doc._id);
//     console.log("subName:", doc.subName);
//     console.log("stored expirey raw:", doc.expirey);
//     console.log("expirey ISO:", e ? e.toISOString() : "none");
//     console.log("expirey instanceof Date:", e instanceof Date);
//     console.log("diff days from today (float):", e ? ((e - today) / (1000*60*60*24)).toFixed(3) : "N/A");
//     console.log("shouldMatch (e >= today && e <= threeDaysfromNow):", e ? (e >= today && e <= threeDaysfromNow) : false);
//   });

//   // now run the actual query you use:
//   const found = await submodel.find({
//     expirey: { $gte: today, $lte: threeDaysfromNow }
//   }).lean();
//   console.log("FOUND BY QUERY:", found.length);
//   found.forEach(f => console.log(" ->", f._id, f.subName, f.expirey));
// }



const runReminderCron = async() => {
  // Run every day at 9:00 AM
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running daily reminder email job...");

     const today = new Date();
     today.setHours(0,0,0,0);
     const threeDaysfromNow = new Date(today);
     threeDaysfromNow.setDate(today.getDate() + 4); // Reminder x days before expiry

     // targetDate.setHours(0, 0, 0, 0); // Set to 00:00 of target day
     // const nextDay = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);



    try {
      const subscriptions = await submodel
        .find({
          expirey: {
            $gte: today,
            $lte: threeDaysfromNow,
          },
        })
        .populate("user"); // Make sure `user` is populated if ref

      if (!subscriptions.length) {
        console.log("✅ No subscriptions expiring in 3 days.");
        return;
      }

      for (let subscription of subscriptions) {
        await sendEmail({
          to: subscription.user.email,
           subject: "Subscription Expiry Reminder",
           templateName: "reminderEmail.html", // file inside your /emails folder
           placeholders: {
            userName: subscription.user.name,
           amount: subscription.amount,
           expiryDate: subscription.expirey.toDateString()
          }

        });
      }
    } catch (err) {
      console.error("❌ Error during reminder cron:", err.message);
    }
  });
};


module.exports = {runReminderCron};


//module.exports = { runReminderCron };