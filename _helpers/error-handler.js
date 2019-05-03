module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.log(err) //TODO: Implement logger
    if (typeof (err) === 'string') {
        return res.status(400).json({message: err});
    }

    if(err.name === 'ValidationError') {
        return res.status(400).json({message: err.message});
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({message: 'Invalid Credentials'});
    }
    
    //Default
    return res.status(500).json({message: err.message});
}