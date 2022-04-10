var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // res.send('welcome to Express.')
  res.status(200).json({
    code: 1,
    message: '路由访问成功.'
  });
});

module.exports = router;
