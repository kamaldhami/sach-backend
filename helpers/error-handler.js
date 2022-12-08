const asyncHandler = fn => (req, res, next) => {
    Promise
        .resolve(fn(req, res, next))
        .catch(next);
};

const tryCatchHandler = function (fn) {
    return (...arg) => {
        try {
            return fn(...arg);
        } catch (err) {
            throw new Error(err);
        }
    };
};

module.exports = {
    asyncHandler,
    tryCatchHandler
};