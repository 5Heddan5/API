const express = require ("express");
const app = express();

app.get("/", (req, res) => {
    return res.send("App is running!");
})

app.listen(3001, () => {
    console.log("Server is running on port3001");
});