const ErrorResponse = require("../utils/errorResponse");
module.exports = (err, req, res, next) => {
//   console.log(
//     err,
//     err.name.yellow
//   );

  if (err.name === "CastError") {
    err = new ErrorResponse(`Resource not found with of ID ${err.value}`, 404);
  }
  if (err.name === "ValidationError") {
    err = new ErrorResponse(
      Object.values(err.errors) 
        .map((v) => v.message)
        .join(", "),
      400
    );
  }
  
  if (err.code === 11000) {
    err = new ErrorResponse("Duplication field value entered", 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    msg: err.message || "Server Error",
  });
};
