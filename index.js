const express = require('express');
const dotenv = require('dotenv');
const app = express();
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

dotenv.config();

//middleware
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(express.static('public'));

//template engine
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');


const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected as ID ' + connection.threadId);
});


const routes = require('./server/routes/user');
app.use('/', routes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});