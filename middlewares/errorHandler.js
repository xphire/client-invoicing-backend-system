const errorHandler = (error,req,res,next) => {

    const mongoPattern = /^Invoice validation failed/;
    if (error)
    {
        console.log(error);
        if (error.message === 'Not allowed by CORS')
        {
            // Handle the CORS error by sending a 403 Forbidden response with a JSON error message
            res.status(403).json({"status" : "failed", error: 'CORS error: Request origin not allowed' });
        } 
        else if (mongoPattern.test(error.message))
        {
            res.status(400).send({"status" : "failed","error" : error.message})
        }
        else 
        {
            // Handle other errors as needed
            res.status(500).send({"status" : "failed","error" : "something went wrong, please try again later"})
        }  
    };    
};


module.exports = errorHandler;