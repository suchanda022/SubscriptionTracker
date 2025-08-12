function calculateExpiryDate(startDate,frequency){
  const date = new Date(startDate);

  if (frequency === "monthly") {
    date.setMonth(date.getMonth() + 1);
  } else if (frequency === "yearly") {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    throw new Error("Invalid frequency. Use 'monthly' or 'yearly'.");
  }

  return date;
}

module.exports = calculateExpiryDate;