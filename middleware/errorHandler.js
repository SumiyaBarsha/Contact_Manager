import constants from "../constant.js";
const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode ? res.statusCode : constants.INTERNAL_SERVER_ERROR;
    
    let errorMessage = err.message;

    switch(statusCode){
        case constants.OK:
            errorMessage = err.message || "OK";
            break;
        case constants.CREATED:
            errorMessage = err.message || "CREATED";
            break;
        case constants.ACCEPTED:
            errorMessage = err.message || "ACCEPTED";
            break;
        case constants.NO_CONTENT:
            errorMessage = err.message || "NO CONTENT";
            break;
        case constants.BAD_REQUEST:
            errorMessage = err.message || "BAD REQUEST";
            break;
        case constants.UNAUTHORIZED:
            errorMessage = err.message || "UNAUTHORIZED";
            break;
        case constants.FORBIDDEN:
            errorMessage = err.message || "FORBIDDEN";
            break;
        case constants.NOT_FOUND:
            errorMessage = err.message || "NOT FOUND";
            break;
        case constants.TOO_MANY_REQUESTS:
            errorMessage = err.message || "TOO MANY REQUESTS";
            break;
        case constants.INTERNAL_SERVER_ERROR:
            errorMessage = err.message || "INTERNAL SERVER ERROR";
            break;
        case constants.NOT_IMPLEMENTED:
            errorMessage = err.message || "NOT IMPLEMENTED";
            break;
        case constants.BAD_GATEWAY:
            errorMessage = err.message || "BAD GATEWAY";
            break;
        case constants.SERVICE_UNAVAILABLE:
            errorMessage = err.message || "SERVICE UNAVAILABLE";
            break;
        case constants.GATEWAY_TIMEOUT:
            errorMessage = err.message || "GATEWAY TIMEOUT";
            break;
        default:
            console.log("No Error! Continue")
            break;
    }

    const errorResponse = {
        message: errorMessage,
        stackTrace: err.stack,
        statusCode: statusCode,
    };
    res.status(statusCode).json(errorResponse);

};

export default errorHandler;