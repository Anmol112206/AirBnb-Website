//This code defines a custom error class in JavaScript 
//using Node.js and Express-style error handling

class ExpressError extends Error {
    constructor (statusCode,message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = ExpressError;