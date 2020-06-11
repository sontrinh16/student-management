module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(err.isOperational){
        if (err.message === 'confirm pass should be the same with new pass'){
            return res.status(err.statusCode).render('update-error',{
                message: err.message
            })
        }

        else if (err.message === 'invalid username or password'){
            return res.status(err.statusCode).render('login-error',{
                message: err.message
            })
        }

        else if (err.message === 'invalid URL'){
            return res.status(err.statusCode).render('error2', {
                message:err.message
            })
        }

        else if (err.message === 'No result'){
            return res.status(err.statusCode).render('error3', {
                message:err.message
            })
        }
        else {
            return res.status(err.statusCode).render('error',{
                    message: err.message
            })
        }
    }

}