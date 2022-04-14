var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var MscampSchema = new Schema({//定义框架
    name: {
        type: String,
        require: [true, '请填写培训课程的名字'], // 必填项
        unique: true, // 唯一性
        trim: true, // 两边去空格
        maxlength: [50, '课程名字不能超过50个字'] // 字符串长度限制
    },
    description: {
        type: String,
        require: [true, '请填写培训课程的描述'],
        maxlength: [500, '课程描述不能超过500个字']
    },
    website: {
        type: String,
        match: [
            /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/, 
            '请填写合法的网址'
        ]
    },
    phone: {
        type: String,
        match: [
            /^(?:(?:\+|00)86)?1\d{10}$/, 
            '请填写正确的手机号'
        ]
    },
    address: {
        type: String,
        default: '枣阳市经开区随阳农场' // 注意：有默认值的字段，前端请求可以不传
    },
    careers: {
        type: [String],
        require: true, 
        enum: ['前端开发', '后端开发', '全栈工程师']
    },
    online: {
        type: Boolean,
        default: true
    },
    createAtt: {
        type: Date,
        default: Date.now
    }
});
var Mscamp = mongoose.model('Mscamp', MscampSchema);// 定义模块
module.exports = Mscamp;// 导出模块，使外部可以调用