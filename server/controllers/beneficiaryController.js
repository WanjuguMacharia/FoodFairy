const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// View beneficiaries
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

exports.newBeneficiary = (req, res) => {
  res.render("addBeneficiary");
};

exports.createBeneficiary = async (req, res) => {
  const { name, contact, location } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    const query =
      "INSERT INTO beneficiaries (beneficiary_name, contact_info, location) VALUES (?, ?, ?)";
    const values = [
      name, contact, location
    ];

    connection.query(query, values, (err, rows) => {
      connection.release();

      if (!err) {
        res.render("addBeneficiary", { alert: "Beneficiary added successfully" });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  });
};


exports.editBeneficiary = (req, res) => {
  pool.getConnection((err, connection) => {
      if (err) {
          console.error("Database connection failed:", err);
          return res.status(500).send("Database connection failed");
      }
      console.log("Connected as ID " + connection.threadId);

      const query = "SELECT * FROM beneficiaries WHERE beneficiary_id = ?";
      const params = [req.params.id];

      connection.query(query, params, (err, rows) => {
          connection.release(); // Ensure connection is released

          if (err) {
              console.error("Query execution failed:", err);
              return res.status(500).send("Failed to fetch beneficiary data");
          }

          if (!rows.length) {
              return res.status(404).send("Beneficiary not found");
          }

          console.log("Data from the table:\n", rows);

          // Render the view with the fetched data
          res.render("editBeneficiary", { rows });
      });
  });
};


exports.updateBeneficiary = (req, res) => {

  const { name, contact, location } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    connection.query("UPDATE beneficiaries SET beneficiary_name = ?, contact_info = ?, location = ? WHERE beneficiary_id = ?", [name, contact, location, req.params.id], (err, rows) => {
      connection.release();

      if (!err) {
        res.render("editBeneficiary", { rows, alert: 'Beneficiary updated successfully' });
      } else {
        console.log(err);
        res.sendStatus(500);
      }

      console.log("Data from the table:\n", rows);
    });
  });
};

// exports.deleteBeneficiary = (req, res) => {

//   pool.getConnection((err, connection) => {
//     if (err) throw err;
//     console.log("Connected as ID " + connection.threadId);

//     connection.query("DELETE  FROM beneficiaries WHERE beneficiary_id =?", [req.params.id], (err, rows) => {
//       connection.release();

//       if (!err) {
//         res.redirect("/");
//       } else {
//         console.log(err);
//         res.sendStatus(500);
//       }

//       console.log("Data from the table:\n", rows);
//     });
//   });
// };