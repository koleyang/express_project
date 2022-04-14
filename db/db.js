const mongoose = require('mongoose');

const connectDB = () => {
    const conn = mongoose.connect(
        // 'mongodb://localhost:27017/test', 
        process.env.LOC_MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    const db = mongoose.connection;
    
    //检查是否连接成功
    db.on("error", (error) => {
        console.log(`数据库连接失败：${error}`.red);
    });
    db.on("open", () => {
        console.log(`连库成功：${db.host}`.green.bold);
    });
}

module.exports = connectDB;