const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
    cors({
        origin:["https://localhost:3000","https://localhost:5173"],
        credentials: true
    })
)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static("public"))


// routes
const course = require("./routes/course.routes.js");
const users = require("./routes/user.routes.js");
const auth = require("./routes/auth.routes.js");


app.use("/api/v1/course/", course);
app.use("/api/v1/user/", users);


module.exports = app;