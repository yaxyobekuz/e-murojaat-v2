// Express handlerdagi async xatolarni markaziy errorHandler'ga uzatadi
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
