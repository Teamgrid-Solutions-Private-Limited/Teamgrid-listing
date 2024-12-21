const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
  
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace in development mode
    });
  };
  
  module.exports = errorHandler;
  