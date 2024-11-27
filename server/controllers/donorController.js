const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// View donors
exports.viewDonors = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    connection.query("SELECT * FROM donors ", (err, rows) => {
      connection.release();

      if (!err) {
        res.render("donor", { rows });
      } else {
        console.log(err);
        res.sendStatus(500);
      }

      console.log("Data from the table:\n", rows);
    });
  });
};

exports.newDonor = (req, res) => {
    res.render("addDonor");
  };

  exports.createDonor = async (req, res) => {
    const { name, contact, address } = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID " + connection.threadId);
  
      const query =
        "INSERT INTO donors (donor_name, contact_info, address) VALUES (?, ?, ?)";
      const values = [name, contact, address];
  
      connection.query(query, values, (err, rows) => {
        connection.release();
  
        if (!err) {
          res.render("addDonor", { alert: "Donor added successfully" });
        } else {
          console.log(err);
          res.sendStatus(500);
        }
      });
    });
  };

  exports.editDonor = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection failed:", err);
            return res.status(500).send("Database connection failed");
        }
        console.log("Connected as ID " + connection.threadId);
  
        const query = "SELECT * FROM donors WHERE donor_id = ?";
        const params = [req.params.id];
  
        connection.query(query, params, (err, rows) => {
            connection.release(); 
  
            if (err) {
                console.error("Query execution failed:", err);
                return res.status(500).send("Failed to fetch beneficiary data");
            }
  
            if (!rows.length) {
                return res.status(404).send("DOnor not found");
            }
  
            console.log("Data from the table:\n", rows);
  
            // Render the view with the fetched data
            res.render("editDonor", { rows });
        });
    });
  };
  


  exports.updateDonor = (req, res) => {

    const { name, contact, address } = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID " + connection.threadId);
  
      connection.query("UPDATE donors SET donor_name = ?, contact_info = ?, address = ? WHERE donor_id = ?", [name, contact, address, req.params.id], (err, rows) => {
        connection.release();
  
        if (!err) {
          res.render("editDonor", { rows, alert: 'Donor updated successfully' });
        } else {
          console.log(err);
          res.sendStatus(500);
        }
  
        console.log("Data from the table:\n", rows);
      });
    });
  };