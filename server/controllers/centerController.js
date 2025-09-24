const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// View centers
exports.viewCenters = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    connection.query("SELECT * FROM distributionCenters ", (err, rows) => {
      connection.release();

      if (!err) {
        res.render("centers", { rows });
      } else {
        console.log(err);
        res.sendStatus(500);
      }

      console.log("Data from the table:\n", rows);
    });
  });
};

exports.newCenter = (req, res) => {
    res.render("addCenters");
  };


  exports.createCenter = async (req, res) => {
    const { name, location, contact } = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID " + connection.threadId);
  
      const query =
        "INSERT INTO distributionCenters (center_name, location, contact_info) VALUES (?, ?, ?)";
      const values = [name, location, contact];
  
      connection.query(query, values, (err, rows) => {
        connection.release();
  
        if (!err) {
          res.redirect("/centers");
        } else {
          console.log(err);
          res.sendStatus(500);
        }
      });
    });
  };

  exports.editCenter = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection failed:", err);
            return res.status(500).send("Database connection failed");
        }
        console.log("Connected as ID " + connection.threadId);
  
        const query = "SELECT * FROM distributionCenters WHERE center_id = ?";
        const params = [req.params.id];
  
        connection.query(query, params, (err, rows) => {
            connection.release(); // Ensure connection is released
  
            if (err) {
                console.error("Query execution failed:", err);
                return res.status(500).send("Failed to fetch center data");
            }
  
            if (!rows.length) {
                return res.status(404).send("Center not found");
            }
  
            console.log("Data from the table:\n", rows);
  
            // Render the view with the fetched data
            res.render("editcenter", { rows });
        });
    });
  };

  exports.updateCenter = (req, res) => {

    const { name, location, contact } = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID " + connection.threadId);
  
      connection.query("UPDATE distributionCenters SET center_name = ?, location = ?, contact_info = ?  WHERE center_id = ?", [name, location, contact, req.params.id], (err, rows) => {
        connection.release();
  
        if (!err) {
          res.redirect("/centers");
        } else {
          console.log(err);
          res.sendStatus(500);
        }
  
        console.log("Data from the table:\n", rows);
      });
    });
  };
  
  