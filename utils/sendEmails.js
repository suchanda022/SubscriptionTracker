const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendPaymentSuccessEmail = async (user, subscription) => {
  try {
    const templatePath = path.join(
      __dirname,
      "..",
      "emails",
      "paymentSuccess.html"
    );
    let emailHtml = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders in HTML with actual values
    emailHtml = emailHtml
      .replace("{{userName}}", user.name)
      .replace("{{subscriptionName}}", subscription.subName)
      .replace("{{amount}}", subscription.amount);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Subscription Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Payment Successful - Receipt",
      html: emailHtml,
    });

    console.log("Payment success email sent!");
  } catch (err) {
    console.error("Error sending payment success email:", err.message);
  }
};

module.exports = { sendPaymentSuccessEmail };
