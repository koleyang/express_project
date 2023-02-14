const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, '请添加名字']
    },
    email: {
        type: String,
        unique: true,
        require: [true, '请填写邮箱'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            '请填写正确的邮箱地址'
        ]
    },
    password: {
        type: String,
        require: [true, '请添加密码'],
        minLength: 6,
        select: false // 不被选中的意思是，该字段在数据响应时不会返回给前端显示
    },
    role: {
        type: String,
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('User', UserSchema);