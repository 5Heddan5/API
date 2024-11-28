const Sqlite3 = require("better-sqlite3");
const db = new Sqlite3("chinook.db");

const getAllCustomers = (req, res) => {
  const query = `SELECT * FROM customers`;
  const stmt = db.prepare(query); //förbereder vår query
  const customers = stmt.all(); // kör queryn

  // Checkar ifall arrayn är tom och skickar "No customers found" ifall den är tom
  if (!customers.length) {
    return res.status(404).json({ message: "No customers found" });
  }
  return res.json(customers);
};

const getCustomerById = (req, res) => {
  const { id } = req.params;

  // Kolla om id är ett giltigt nummer
  if (!parseInt(id)) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  const query = `SELECT * FROM customers WHERE CustomerId = ?`; // Behöver ett värde
  const stmt = db.prepare(query);
  const customer = stmt.get([id]); // hämtar första matchningen och lägger in "id" på "?"

  if (!customer) {
    return res
      .status(404)
      .json({ message: `Customer with id ${id} doesn't exist.` });
  }

  // Skicka tillbaka kunden som hittats
  return res.json(customer);
};

const getCustomerByIdWithInvoices = (req, res) => {
  // Få customer först
  const { id } = req.params;

  // Kolla om id är ett giltigt nummer
  if (!parseInt(id)) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  const query = `SELECT CustomerId, FirstName, LastName FROM customers WHERE CustomerId = ?`; // Behöver ett värde
  const stmt = db.prepare(query);
  const customer = stmt.get([id]); // hämtar första matchningen och lägger in "id" på "?"

  if (!customer) {
    return res
      .status(404)
      .json({ message: `Customer with id ${id} doesn't exist.` });
  }

  // Få invoices på customers
  const invoiceQuery = `SELECT invoiceId, Total FROM invoices WHERE CustomerId = ?`;
  const invoiceStmt = db.prepare(invoiceQuery);
  const invoices = invoiceStmt.all([id]);

  if (invoices.length === 0) {
    return res
      .status(404)
      .json({ message: `Customer ${id}, doesn't have any invoices` });
  }

  const customerWithInvoices = {
    ...customer, // Kommer att kopliera alla key-value pairs från customer objektet
    invoices, // Invoices: invoices // attribut Invoices som får värdet invoices
  };
  // Sätt ihop dem och skicka en response

  return res.json(customerWithInvoices);
};

const postCustomer = (req, res) => {
  const { body } = req;
  const { FirstName, LastName, Email } = body;

  // Ternary operator
  const bodyIsComplete = FirstName && LastName && Email ? true : false;

  if (!bodyIsComplete === false) {
    return res
      .status(400)
      .json({ message: "Body is not complete or malforemed" });
  }

  const query = `
  INSERT INTO customers (FirstName, LastName, Email)
  VALUES (?, ?, ?)
  `;

  const stmt = db.prepare(query);
  stmt.run([FirstName, LastName, Email]);

  return res.status(201).json({ message: "Customer was successfully created" });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByIdWithInvoices,
  postCustomer,
};
