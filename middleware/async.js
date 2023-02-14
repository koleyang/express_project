const asyncHandler = (fn) => (req, res, next) => {
    // 这个自定义方法也是express-async-handler插件的基本原理
    Promise.resolve(fn(req, res, next)).catch(next) // 用promise的catch来捕获next()中抛出来的值,所以业务代码中只需要写next(error)抛出异常即可
}; // 注意：这个fn是个函数，有可能是正确处理函数，也有可能是异常处理函数，比如--next(error)

module.exports = asyncHandler;