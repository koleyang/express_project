var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { // /根路由代表 /users======>这一段：app.use('/users', usersRouter);  // 注册用户路由接口
  res.send('respond with a resource');
});

module.exports = router;
