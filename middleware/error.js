const errorHandler = (error, req, res, next) => { // 
    console.log('error=======>', error);
    console.log(error.stack.red);
    console.log(error.name.blue); // 这就是错误类型，前台postman上可以看到
    console.log(error.message.red); // 这就是错误消息，前台postman上可以看到
    console.log(error.status); // 这就是错误状态码

    res.status(error.status || 500).json({success: false, error: error || 'Server error'});
}

module.exports = errorHandler;