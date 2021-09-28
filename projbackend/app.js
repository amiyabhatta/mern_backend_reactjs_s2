require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
// const categoryRoutes = require("./routes/category");



app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/api",authRoutes);
// app.use("/api",userRoutes);
// app.use("/api",categoryRoutes);

mongoose.connect(process.env.DATABASE, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}
).then(()=>{
    console.log("DB Connected");
}).catch(() => {
   console.log("Mongo Db conection error!") 
});

const port = process.env.PORT || 8000;

app.listen(port,() => {
    console.log(`app is running at ${port}`);
})

app.get('/', (req,res) => {
    return res.send("Hello Worlds!!");
})