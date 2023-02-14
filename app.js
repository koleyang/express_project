const createHttpError = require('http-errors'); // http-errors错误处理中间件
const express = require('express');
const path = require('path'); // 引入内置处理路径模块
const cookieParser = require('cookie-parser'); // 加载处理cookie中间件
const logger = require('morgan'); // 引入日志打印插件 
const dotenv = require('dotenv');
const colors = require('colors');
const Mscamp = require('./model/Mscamp.js');
const asyncHandler = require('./middleware/async');
const errorHandler = require('./middleware/error');

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
// 普通get路由写法----由异步处理中间件express-async-handler原理来改造一下这个接口
// app.get('/api/v1/mscamps', asyncHandler(async (req, res) => {
//   console.log(req.query);
//   // const mscamps = await Mscamp.find(req.query).select('-_id'); // 链式调用去_id
//   // const mscamps = await Mscamp.find(req.query).select('name phone -_id'); // 链式调用只查name,phone字段，并同时去掉_id
//   // Mscamp.find(req.query).select('name phone -_id').exec((err, txs) => { 
//   //   console.log('我是select选择后的查询结果 ===========>', txs); 
//   //   mscamps = txs;
//   // });
//   // const mscamps = [];
//   // await Mscamp.find(req.query, 'name phone -_id', (err, item) => {
//   //   console.log('我是select选择后的查询结果 ===========>', item); 
//   //   mscamps = item;
//   //   res.status(200).json({success: true, data: mscamps, count: mscamps.length});
//   // }) //Notice, this will omit _id! function (err, docs){}

//   // const mscamps = await Mscamp.find({}, {phone: 0}); // 定向查询，不需要查询phone这个字段
//   // const mscamps = await Mscamp.select({name: 1}); // 定向查询，不需要查询phone这个字段
//   // console.log('get请求查出表内所有数据使用find() ===========>', mscamps);
//   const mscamps = await Mscamp.find(req.query, 'name phone createAt averageCost -_id').sort('-averageCost'); // 倒序：sort('-指定字段')
//   res.status(200).json({success: true, data: mscamps, count: mscamps.length});
// }));
// 下面是分页演示，主要是skip()和limit()方法的调用
app.get('/api/v1/mscamps', asyncHandler(async (req, res) => {
  console.log(req.query);
  // 定义分页涉及到的几个变量
  const page = parseInt(req.query.page, 10) || 1; // 定义当前页码，默认是第1页
  const limit = parseInt(req.query.limit, 10) || 2; // 定义一页显示条数，2(默认)就是一页只显示两条，10就是一页显示10条
  const index = (page - 1) * limit; // 定义skip算法，所谓的分页就是显示--入参页码-1 乘以 限制条数 ,这就是skip的参数
  const mscamps = await Mscamp.find(req.query, 'name phone createAt averageCost -_id').sort('-averageCost').skip(index).limit(limit); // skip(index).limit(limit)这就是分页
  res.status(200).json({success: true, data: mscamps, count: mscamps.length});
}));
// app.get('/api/v1/mscamps', async (req, res, next) => {
//   try {
//     // res.status(200).json({success: true, message: '米修在线'});
//     const mscamps = await Mscamp.find(); // 直接用表对象调用find()查询所有
//     console.log('get请求查出表内所有数据使用find() ===========>', mscamps);
//     res.status(200).json({success: true, data: mscamps, count: mscamps.length});
    
//   } catch (error) {
//     // res.status(400).json({success: false, error});
//     next(error); // 接口路由里面不再处理错误信息，把异常报错抛出去给专门的中间件来处理
//   }
// });

// get带参数:id路由写法
app.get('/api/v1/mscamps/:id', asyncHandler(async (req, res, next) => {
  try {
    // res.status(200).json({success: true, message: `获取${req.params.id}个米修在线数据`});
    const mscamp = await Mscamp.findById(req.params.id); // 这个属于异步请求，如果发生错误就是异步错误，一般express捕获不到，需要异步捕获。直接用表对象调用findById()根据id查询单个数据
    // if(!mscamp) { // 把这个判断逻辑放到catch捕获也是可以省略这一步的
    //   res.status(400).json({success: false});
    // }
  }
  catch (error) {
    console.log('get请求根据id使用findById()查出单个数据时报的异常 ===========>', error);
    // res.status(400).json({success: false, error}); // 最原始的http报错
    // next(error);
    next(createHttpError(400, `${error}`)); // 实战中推荐这一种message错误描述形式返回给前台
    // next(createHttpError(400, error)); // 这是调试模式，把错误对象所有属性都返回给前台看
  }
  res.status(200).json({success: true, data: mscamp}); // 成功处理应该写在try...catch的最外面，这样前面的逻辑就可以把所有错误逻辑全部处理完毕，才会走到成功这里来
}));

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
      res.status(400).json({success: false});
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

app.use(errorHandler);
// error handler express框架封装的错误处理中间件(实际上错误处理不需要自己定义了)
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createHttpError(404)); // 404由http-errors来报错处理
// });

// unhandledRejection是未被处理的Promise rejection
// process.on('unhandledRejection', (reason, promise) => {
//   // 给出未被处理的原因
//   console.error(reason, 'Unhandled Rejection at Promise', promise);
// }).on('uncaughtException', err => { // 监听全局异常
//   console.error(err, 'Uncaught Exception thrown');
//   // 如果遇到全局异常，就关闭服务器并退出进程
//   server.close(() => {
//     process.exit(1);
//   });
// });

module.exports = app;
