var createError = require('http-errors'); // 加载处理错误的中间件
var express = require('express');
var path = require('path'); // 引入内置处理路径模块
var cookieParser = require('cookie-parser'); // 加载处理cookie中间件
var logger = require('morgan'); // 引入日志打印插件 
const dotenv = require('dotenv');
const colors = require('colors');
const Mscamp = require('./model/Mscamp.js');

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
app.use(express.json()); // 中间件解析req.body,这里是处理post请求的body体的中间件调用的地方
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // 处理cookie
app.use(express.static(path.join(__dirname, 'public'))); // 指定静态文件目录

app.use('/', indexRouter); // 注册主路由接口
app.use('/users', usersRouter);  // 注册用户路由接口

// 创建自定义的打印日志中间件clogger
const clogger = (req, res, next) => {
  console.log(`${req.method} ${req.protocal}://${req.get('host')}${req.originalUrl}`.red); // colors中间件就是用来改变字符串的打印颜色的，在字符串后面.颜色属性即可
  next();
}
// app.use(clogger); // 因为使用了morgan日志中间件，所以这个自定义的先不调用
// 普通get路由写法
app.get('/api/v1/mscamps', async (req, res) => {
  try {
    // res.status(200).json({success: true, message: '米修在线'});
    const mscamps = await Mscamp.find(); // 直接用表对象调用find()查询所有
    console.log('get请求查出表内所有数据使用find() ===========>', mscamps);
    res.status(200).json({success: true, data: mscamps, count: mscamps.length});
    
  } catch (error) {
    res.status(400).json({success: false, error});
  }
});

// get带参数:id路由写法
app.get('/api/v1/mscamps/:id', async (req, res) => {
  try {
    // res.status(200).json({success: true, message: `获取${req.params.id}个米修在线数据`});
    const mscamps = await Mscamp.findById(req.params.id); // 直接用表对象调用findById()根据id查询单个数据
    console.log('get请求根据id使用findById()查出单个数据 ===========>', mscamps);
    // 查询单个数据，如果没有查询到，返回400处理
    if(!mscamp) {
      return res.status(400).json({success: false});
    }
    res.status(200).json({success: true, data: mscamps});
    
  } catch (error) {
    res.status(400).json({success: false, error});
  }
});

// 普通post写法
app.post('/api/v1/mscamps', async (req, res) => {
  try {
    console.log('post请求发送过来的body体 ===========>', req.body);
    const mscamp = await Mscamp.create(req.body);
    res.status(200).json({success: true, message: mscamp});
  } catch (error) {
    // 重复新增同一条数据使用try...catch...来捕获异常，并返回给前端，报错400
    res.status(400).json({success: false, error});
  }
});


// 普通put 修改写法
app.put('/api/v1/mscamps/:id', async (req, res) => {
  try {
    // res.status(200).json({success: true, message: `修改第${req.params.id}个米修在线数据`});
    const mscamp = await Mscamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 返回更新后的值
      runValidators: true // 开启表结构里面的验证规则
    });
    // 修复更新逻辑上是否还存在已删除数据的问题
    if(!mscamp) {
      return res.status(400).json({success: false});
    }
    res.status(200).json({success: true, data: mscamp});
  } catch (error) {
    res.status(400).json({success: false, error});
  }
});


// 普通delete删除写法
app.delete('/api/v1/mscamps/:id', async (req, res) => {
  // res.status(200).json({success: true, message: `删除第${req.params.id}个米修在线数据`});
  try {
    const mscamp = await Mscamp.findByIdAndDelete(req.params.id);
    // 修复删除逻辑上是否还存在已删除数据的问题
    if(!mscamp) {
      return res.status(400).json({success: false});
    }
    res.status(200).json({success: true, data: {}}); // 删除一般只返回删除成功的提示和一个空数据
  } catch (error) {
    res.status(400).json({success: false, error});
  }
});

// 注意：上面的写法可以统一使用路由来管理，把/api/v1/mscamps作为路由根路由来触发对应的路径接口，然后跟上请求方式就是restful API了


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// unhandledRejection是未被处理的Promise rejection
process.on('unhandledRejection', (reason, promise) => {
  // 给出未被处理的原因
  console.error(reason, 'Unhandled Rejection at Promise', promise);
}).on('uncaughtException', err => { // 监听全局异常
  console.error(err, 'Uncaught Exception thrown');
  // 如果遇到全局异常，就关闭服务器并退出进程
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
