

const notFound = (req,res,next) => {
    const error = new Error (`Not Found - ${req.originalUrl}`);

    res.status(404);
    next(error);
};


// const errorHandler = (err,req,res,next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);

//     res.json({
//         message: err?.message,
//         stack : process.env.NODE_ENV === "production" ? null :  err.stack

//     });
// };

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(statusCode).json({
      message: "Validation failed",
      errors: messages,
    });
  }

  // Handle duplicate email error
  if (err.code === 11000) {
    statusCode = 400;
    return res.status(statusCode).json({
      message: "Duplicate field value entered",
      field: err.keyValue,
    });
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {errorHandler,notFound};