const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3517;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_3517", // PostgreSQLのユーザー名に置き換えてください。
  host: "localhost",
  database: "crm_3517", // PostgreSQLのデータベース名に置き換えてください。
  password: "pass_3517", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/customers/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [customerId]);

    if (customerData.rows.length > 0) {
      res.send(customerData.rows[0]);
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.delete("/customers/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const deleteResult = await pool.query("DELETE FROM customers WHERE customer_id = $1 RETURNING *", [customerId]);

    if (deleteResult.rows.length > 0) {
      res.json({ success: true, deletedCustomer: deleteResult.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Customer not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting customer" });
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.put("/customers/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { companyName, industry, contact, location } = req.body;

    const updateResult = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4, updated_date = CURRENT_TIMESTAMP WHERE customer_id = $5 RETURNING *",
      [companyName, industry, contact, location, customerId]
    );

    if (updateResult.rows.length > 0) {
      res.json({ success: true, updatedCustomer: updateResult.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Customer not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating customer" });
  }
});

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));
