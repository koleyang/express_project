var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { // /根路由代表 /users======>这一段：app.use('/users', usersRouter);  // 注册用户路由接口
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) { // 用户登录
  res.status(200).json({success: true, message: '用户登录成功'})
});

module.exports = router;
