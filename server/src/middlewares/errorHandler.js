// Markaziy xato ushlagich — izchil { success:false, message, code } shakli
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    success: false,
    message: err.message || "Server xatosi",
    code: err.code || "ERROR",
  });
};

export default errorHandler;
