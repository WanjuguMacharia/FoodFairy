const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// View records
exports.viewRecords = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    connection.query("SELECT * FROM deliveryRecords ", (err, rows) => {
      connection.release();

      if (!err) {
        res.render("records", { rows });
      } else {
        console.log(err);
        res.sendStatus(500);
      }

      console.log("Data from the table:\n", rows);
    });
  });
};

exports.newRecord = (req, res) => {
  res.render("addRecord");
};

exports.createRecord = async (req, res) => {
  const { donor, beneficiary, center, foodType, quantity, date, status } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    const query = `
     SELECT 
        dr.record_id,
        d.donor_name,
        b.beneficiary_name,
        c.center_name,
        f.food_type,
        dr.quantity,
        dr.delivery_date,
        dr.delivery_status
      FROM deliveryRecords dr
      JOIN donors d ON dr.donor_id = d.donor_id
      JOIN beneficiaries b ON dr.beneficiary_id = b.beneficiary_id
      JOIN fistributioncenters c ON dr.center_id = c.center_id
      JOIN food_name f ON dr.food_type_id = f.food_type_id
    `;

    const values = [donor, beneficiary, center, foodType, quantity, date, status];

    connection.query(query, values, (err, rows) => {
      connection.release();

      if (!err) {
        res.redirect("/records");
      } else {
        console.log("❌ Error inserting record:", err);
        res.sendStatus(500);
      }
    });
  });
};
