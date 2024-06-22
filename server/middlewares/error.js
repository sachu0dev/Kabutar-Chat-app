const errorMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  })

};

const TryCatch = (fn)=> async(req, res, next)=> {
  try {
   await fn(req, res, next)
  } catch (error) {
    next(error)
  }
}

export {errorMiddleware, TryCatch}