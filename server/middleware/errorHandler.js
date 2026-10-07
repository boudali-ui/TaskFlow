

function errorHandler(error, req, res, next) {
    if (error.name === "CastError") {
        return res.status(400).json({
            "message": "Invalid task id"
        });
    };

    if (error.code === 11000) {
        return res.status(409).json({
            message: "Email already exists"
        });
    };

    if (error.name === "ValidationError") {
        return res.status(400).json({
            message: error.message
        });
    };

    const status = error.status || 500;

    if (status === 500) {
        console.error(error);
    }
    return res.status(status).json({
        message:
            status === 500
                ? "Internal Server Error"
                : error.message
    });
};

module.exports = errorHandler;

