const express = require("express");
const app = express();

const port = 8000;

app.get('/', (req,res) => {
    return res.send("Hello Worlds!!");
})

app.listen(port,() => {
    console.log("servre is up and running...");
})