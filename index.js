const {
  getAllCustomers,
  getCustomerById,
  getCustomerByIdWithInvoices,
  postCustomer,
} = require("./customer.controller.js");

const express = require("express");
const app = express();

// Ser till att det finns ett body attribute på req objektet 
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("App is running!");
});

app.get("/customers", getAllCustomers);
app.get("/customers/:id", getCustomerById);
app.get("/customer/:id/with-invoices", getCustomerByIdWithInvoices);
app.post("/customers", postCustomer);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
