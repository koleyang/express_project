const fs = require('fs');
const dotenv = require('dotenv');
const colors = require('colors');
const mongoose = require('mongoose');
const Mscamp = require('./model/Mscamp.js');

dotenv.config({ // 注册环境变量配置
    path: './config/config.env'
});

const conn = mongoose.connect(
    // 'mongodb://localhost:27017/test', 
    process.env.LOC_MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// 读取本地json文件
const mscamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/mscamps.json`, 'utf-8')
)

// 导入数据到mongodb数据库
const importData = async () => {
    try {
        await Mscamp.create(mscamps); // 用模型对象操作数据的新增
        console.log('数据存储成功'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

// 删除mongodb数据库中所有数据
const deleteData = async () => {
    try {
        await Mscamp.deleteMany(); // 用模型对象操作数据的全部删除
        console.log('数据删除成功'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}


console.log('seeder.js进程参数：：', process.argv); // 为什么要打印参数，因为我们要根据参数来调用上面的导入数据方法和删除数据方法
// 根据命令行参数来判断是导入数据还是删除数据
if (process.argv[2] === '-i') {
    importData();
}else if (process.argv[2] === '-d') {
    deleteData();
}
