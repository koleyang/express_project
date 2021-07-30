var createError = require('http-errors'); // 加载处理错误的中间件
var express = require('express');
var path = require('path'); // 引入内置处理路径模块
var cookieParser = require('cookie-parser'); // 加载处理cookie中间件
var logger = require('morgan'); // 引入日志打印插件 
const dotenv = require('dotenv');

dotenv.config({ // 注册环境变量配置
  path: './config/config.env'
});

var indexRouter = require('./routes/index'); // 引入主路由接口
var usersRouter = require('./routes/users'); // 引入用户路由接口

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 指定访问views时的视图文件目录
app.set('view engine', 'jade'); // 模板引擎使用jade模板

app.use(logger('dev')); // 设置开发模式打印日志
app.use(express.json()); // 中间件解析req.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // 处理cookie
app.use(express.static(path.join(__dirname, 'public'))); // 指定静态文件目录

app.use('/', indexRouter); // 注册主路由接口
app.use('/users', usersRouter);  // 注册用户路由接口

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
