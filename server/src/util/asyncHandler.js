const asyncHandler = (requestHandler) => {
    return (req, res, data) => {
        Promise.resolve(requestHandler(req, res, data)).catch((err) => next(err));
    }
}

export {asyncHandler}