const mysql = require("mysql2");


const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// View users
exports.viewBeneficiaries = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    connection.query("SELECT * FROM beneficiaries ", (err, rows) => {
      connection.release();

      if (!err) {
        res.render("beneficiaries", { rows });
      } else {
        console.log(err);
        res.sendStatus(500);
      }

      console.log("Data from the table:\n", rows);
    });
  });
};