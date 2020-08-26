const mysql = require('mysql');
require('dotenv').config();


const connectDB = mysql.createConnection({
    host: process.env.HOST,
    user: 'eyedev@eyedb',
    password: process.env.PASSWORD,
    database: process.env.DB,
    ssl: true
});

connectDB.connect((err) => {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return
    }
    console.log('DB connected...');
})
// var sql = "ALTER TABLE task ADD COLUMN week VARCHAR(250) after date";
// connectDB.query(sql, function(err, res){
//     if(err) throw err;
//     console.log("kytr")
// })

// keep my connection always live my dear, please naa
setInterval(function () {
    connectDB.query('SELECT 1');
}, 3000);
// Thank You for keeping my connection life my love

module.exports = connectDB;